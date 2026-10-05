package com.example.student_management.dao;

import com.example.student_management.entity.Major;

import java.util.List;

public interface MajorDAO {
    Major save(Major major);
    Major findById(Long id);
    List<Major> findAll();
    void update(Major major);
    void delete(Long id);
}