package com.example.assignment_backend.repository;

import com.example.assignment_backend.entity.BorrowedBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BorrowedBookRepository
        extends JpaRepository<BorrowedBook, Long>, JpaSpecificationExecutor<BorrowedBook> {
}