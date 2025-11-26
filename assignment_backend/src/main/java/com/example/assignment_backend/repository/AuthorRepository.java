package com.example.assignment_backend.repository;

import com.example.assignment_backend.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorRepository extends JpaRepository<Author, Long> {
}