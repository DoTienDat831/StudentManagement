package com.example.student_management.service;

import com.example.student_management.dao.SubjectDAO;
import com.example.student_management.entity.Subject;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectDAO subjectDAO;

    public SubjectService(SubjectDAO subjectDAO) {
        this.subjectDAO = subjectDAO;
    }

    public Subject createSubject(Subject subject) {
        return subjectDAO.save(subject);
    }

    public List<Subject> getAllSubjects() {
        return subjectDAO.findAll();
    }

    public Subject getSubjectById(Long id) {
        return subjectDAO.findById(id);
    }

    public Subject updateSubject(Long id, Subject subject) {

        Subject existingSubject = subjectDAO.findById(id);

        if (existingSubject == null) {
            return null;
        }

        existingSubject.setName(subject.getName());
        existingSubject.setMajor(subject.getMajor());

        subjectDAO.update(existingSubject);

        return existingSubject;
    }

    public void deleteSubject(Long id) {
        subjectDAO.delete(id);
    }
}