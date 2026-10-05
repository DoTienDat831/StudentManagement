package com.example.student_management.controller;

import com.example.student_management.entity.Major;
import com.example.student_management.service.MajorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/majors")
public class MajorController {

    private final MajorService majorService;

    public MajorController(MajorService majorService) {
        this.majorService = majorService;
    }

    @PostMapping
    public ResponseEntity<Major> createMajor(
            @RequestBody Major major) {

        Major createdMajor =
                majorService.createMajor(major);

        return ResponseEntity.ok(createdMajor);
    }

    @GetMapping
    public ResponseEntity<List<Major>> getAllMajors() {

        return ResponseEntity.ok(
                majorService.getAllMajors()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Major> getMajorById(
            @PathVariable Long id) {

        Major major =
                majorService.getMajorById(id);

        if (major == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(major);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Major> updateMajor(
            @PathVariable Long id,
            @RequestBody Major major) {

        Major updatedMajor =
                majorService.updateMajor(id, major);

        if (updatedMajor == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedMajor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMajor(
            @PathVariable Long id) {

        Major major =
                majorService.getMajorById(id);

        if (major == null) {
            return ResponseEntity.notFound().build();
        }

        majorService.deleteMajor(id);

        return ResponseEntity.noContent().build();
    }
}