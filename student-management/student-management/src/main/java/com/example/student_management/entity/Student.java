package com.example.student_management.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDate dateOfBirth;

    private String enrollmentYear;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department departments;

    public Student() {
    }

    public Student(String name, LocalDate dateOfBirth, Department departments, String enrollmentYear) {
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.departments = departments;
        this.enrollmentYear = enrollmentYear;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Department getDepartment() {
        return departments;
    }

    public void setDepartment(Department department) {
        this.departments = department;
    }

    public String getEnrollmentYear() {
        return enrollmentYear;
    }

    public void setEnrollmentYear(String enrollmentYear) {
        this.enrollmentYear = enrollmentYear;
    }
}