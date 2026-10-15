package com.example.student_management.dao;

import com.example.student_management.entity.Document;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DocumentDAOImpl implements DocumentDAO {
    private final EntityManager entityManager;

    public DocumentDAOImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Document save(Document document) {
        entityManager.persist(document);
        return document;
    }

    @Override
    public List<Document> findAllActive() {
        return entityManager.createQuery(
                        "SELECT d FROM Document d WHERE d.deleted = false ORDER BY d.id DESC",
                        Document.class)
                .getResultList();
    }

    @Override
    public Document findByPk(String id) {
        try {
            return entityManager.find(Document.class, Long.valueOf(id));
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    @Override
    public Document findByObjectKey(String objectKey) {
        return entityManager.createQuery(
                        "SELECT d FROM Document d WHERE d.objectKey = :objectKey AND d.deleted = false",
                        Document.class)
                .setParameter("objectKey", objectKey)
                .getResultStream()
                .findFirst()
                .orElse(null);
    }

    @Override
    public Document update(Document document) {
        return entityManager.merge(document);
    }
}
