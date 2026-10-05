package com.example.student_management.dao;

import com.example.student_management.entity.Subject;

import java.util.List;

public interface SubjectDAO {
    Subject save(Subject subject);
    Subject findById(Long id);
    List<Subject> findAll();
    void update(Subject subject);
    void delete(Long id);
}