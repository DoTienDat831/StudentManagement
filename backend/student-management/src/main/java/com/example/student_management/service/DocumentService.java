package com.example.student_management.service;

import com.example.student_management.dao.DocumentDAO;
import com.example.student_management.entity.Document;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class DocumentService {
    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);
    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of("pdf", "xlsx", "xls", "doc", "docx", "jpg", "jpeg");

    private final MinioClient minioClient;
    private final DocumentDAO documentDAO;

    @Value("${app.minio.bucket}")
    private String bucket;

    public DocumentService(MinioClient minioClient, DocumentDAO documentDAO) {
        this.minioClient = minioClient;
        this.documentDAO = documentDAO;
    }

    @Transactional
    public Document upload(MultipartFile file) {
        validateFile(file);
        String originalName = safeOriginalName(file.getOriginalFilename());
        String extension = getExtension(originalName);
        String objectKey = UUID.randomUUID() + "." + extension;
        String contentType = file.getContentType() == null
                ? MediaType.APPLICATION_OCTET_STREAM_VALUE : file.getContentType();

        try (InputStream input = file.getInputStream()) {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectKey)
                    .stream(input, file.getSize(), (long) -1)
                    .contentType(contentType)
                    .build());

            Document document = new Document();
            document.setName(originalName);
            document.setObjectKey(objectKey);
            document.setContentType(contentType);
            document.setSize(file.getSize());
            return documentDAO.save(document);
        } catch (Exception exception) {
            // If metadata persistence fails after the object upload, compensate by removing it.
            try {
                minioClient.removeObject(RemoveObjectArgs.builder()
                        .bucket(bucket).object(objectKey).build());
            } catch (Exception cleanupException) {
                logger.error("Could not clean up uploaded object {}", objectKey, cleanupException);
            }
            logger.error("Document upload failed", exception);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Không thể upload tài liệu", exception);
        }
    }

    @Transactional(readOnly = true)
    public List<Document> findAll() {
        return documentDAO.findAllActive();
    }

    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> download(String filePath) {
        Document document = documentDAO.findByObjectKey(filePath);
        if (document == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài liệu");
        }

        try (InputStream input = minioClient.getObject(GetObjectArgs.builder()
                .bucket(bucket)
                .object(document.getObjectKey())
                .build())) {
            byte[] data = input.readAllBytes();
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(document.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            ContentDisposition.attachment()
                                    .filename(document.getName(), StandardCharsets.UTF_8)
                                    .build().toString())
                    .body(data);
        } catch (Exception exception) {
            logger.error("Document download failed for {}", filePath, exception);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Không thể tải tài liệu từ MinIO", exception);
        }
    }

    @Transactional
    public String delete(String id) {
        Document document = fetchAndValidateDocumentById(id);
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucket)
                    .object(document.getObjectKey())
                    .build());
            // Keep the metadata row as a soft delete, matching the supplied template.
            document.setDeleted(true);
            documentDAO.update(document);
            return "success";
        } catch (Exception exception) {
            logger.error("Document delete failed for id {}", id, exception);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Không thể xóa tài liệu khỏi MinIO", exception);
        }
    }

    public Document fetchAndValidateDocumentById(String id) {
        Document document = id == null ? null : documentDAO.findByPk(id);
        if (document == null || document.isDeleted()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài liệu");
        }
        return document;
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File không được để trống");
        }
        String extension = getExtension(file.getOriginalFilename());
        logger.info("Extension from multipart: {}", extension);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                    "Định dạng file không được hỗ trợ");
        }
    }

    private String getExtension(String filename) {
        if (filename == null) return "";
        int dot = filename.lastIndexOf('.');
        return dot < 0 ? "" : filename.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    private String safeOriginalName(String filename) {
        if (filename == null || filename.isBlank()) return "document";
        // Do not retain any client-supplied path components.
        String normalized = filename.replace('\\', '/');
        return normalized.substring(normalized.lastIndexOf('/') + 1);
    }
}
