package com.example.student_management.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_code", unique = true)
    private String studentCode;

    private String name;

    private LocalDate dateOfBirth;

    private LocalDate enrollmentTime;

    private String email;

    @ManyToOne
    @JoinColumn(name = "major_id")
    private Major major;

    public Student() {
    }

    public Student(
            String name,
            LocalDate dateOfBirth,
            String studentCode,
            LocalDate enrollmentTime,
            Major major,
            String email
    ) {
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.studentCode = studentCode;
        this.enrollmentTime = enrollmentTime;
        this.major = major;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
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

    public LocalDate getEnrollmentTime() {
        return enrollmentTime;
    }

    public void setEnrollmentTime(LocalDate enrollmentTime) {
        this.enrollmentTime = enrollmentTime;
    }

    public Major getMajor() {
        return major;
    }

    public void setMajor(Major major) {
        this.major = major;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}