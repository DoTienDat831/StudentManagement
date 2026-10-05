package com.example.student_management.dao;

import com.example.student_management.entity.Subject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class SubjectDAOImpl implements SubjectDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Subject save(Subject subject) {
        entityManager.persist(subject);
        return subject;
    }

    @Override
    public Subject findById(Long id) {
        return entityManager.find(Subject.class, id);
    }

    @Override
    public List<Subject> findAll() {
        return entityManager
                .createQuery("SELECT s FROM Subject s", Subject.class)
                .getResultList();
    }

    @Override
    public void update(Subject subject) {
        entityManager.merge(subject);
    }

    @Override
    public void delete(Long id) {
        Subject subject = entityManager.find(Subject.class, id);

        if (subject != null) {
            entityManager.remove(subject);
        }
    }
}