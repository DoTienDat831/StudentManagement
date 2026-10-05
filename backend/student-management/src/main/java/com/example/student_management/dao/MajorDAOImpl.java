package com.example.student_management.dao;

import com.example.student_management.entity.Major;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class MajorDAOImpl implements MajorDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Major save(Major major) {
        entityManager.persist(major);
        return major;
    }

    @Override
    public Major findById(Long id) {
        return entityManager.find(Major.class, id);
    }

    @Override
    public List<Major> findAll() {
        return entityManager
                .createQuery("SELECT m FROM Major m", Major.class)
                .getResultList();
    }

    @Override
    public void update(Major major) {
        entityManager.merge(major);
    }

    @Override
    public void delete(Long id) {
        Major major = entityManager.find(Major.class, id);

        if (major != null) {
            entityManager.remove(major);
        }
    }
}