package com.example.student_management.controller;

import com.example.student_management.entity.Subject;
import com.example.student_management.service.SubjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping
    public ResponseEntity<Subject> createSubject(
            @RequestBody Subject subject) {

        Subject createdSubject =
                subjectService.createSubject(subject);

        return ResponseEntity.ok(createdSubject);
    }

    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {

        return ResponseEntity.ok(
                subjectService.getAllSubjects()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubjectById(
            @PathVariable Long id) {

        Subject subject =
                subjectService.getSubjectById(id);

        if (subject == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(subject);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubject(
            @PathVariable Long id,
            @RequestBody Subject subject) {

        Subject updatedSubject =
                subjectService.updateSubject(id, subject);

        if (updatedSubject == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedSubject);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(
            @PathVariable Long id) {

        Subject subject =
                subjectService.getSubjectById(id);

        if (subject == null) {
            return ResponseEntity.notFound().build();
        }

        subjectService.deleteSubject(id);

        return ResponseEntity.noContent().build();
    }
}