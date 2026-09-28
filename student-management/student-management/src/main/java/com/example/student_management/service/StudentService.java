package com.example.student_management.service;

import com.example.student_management.dao.StudentDAO;
import com.example.student_management.entity.Student;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {

    private final StudentDAO studentDAO;

    public StudentService(StudentDAO studentDAO) {
        this.studentDAO = studentDAO;
    }

    @Transactional
    public void createStudent(Student student) {
        studentDAO.save(student);
    }

    @Transactional(readOnly = true)
    public Student getStudentById(Long id) {
        return studentDAO.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        return studentDAO.findAll();
    }

    @Transactional
    public Student updateStudent(Long id, Student student) {
        studentDAO.update(student);
        return student;
    }

    @Transactional
    public void deleteStudent(Long id) {
        studentDAO.delete(id);
    }
}