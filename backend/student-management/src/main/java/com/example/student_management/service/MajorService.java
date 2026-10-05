package com.example.student_management.service;

import com.example.student_management.dao.MajorDAO;
import com.example.student_management.entity.Major;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MajorService {

    private final MajorDAO majorDAO;

    public MajorService(MajorDAO majorDAO) {
        this.majorDAO = majorDAO;
    }

    public Major createMajor(Major major) {
        return majorDAO.save(major);
    }

    public List<Major> getAllMajors() {
        return majorDAO.findAll();
    }

    public Major getMajorById(Long id) {
        return majorDAO.findById(id);
    }

    public Major updateMajor(Long id, Major major) {

        Major existingMajor = majorDAO.findById(id);

        if (existingMajor == null) {
            return null;
        }

        existingMajor.setName(major.getName());
        existingMajor.setDepartment(major.getDepartment());

        majorDAO.update(existingMajor);

        return existingMajor;
    }

    public void deleteMajor(Long id) {
        majorDAO.delete(id);
    }
}