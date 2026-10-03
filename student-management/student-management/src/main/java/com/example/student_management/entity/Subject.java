package com.example.student_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "major_id")
    private Major major;

    // Constructors
    public Subject() {
    }

    public Subject(String name, Major major) {
        
    }
}