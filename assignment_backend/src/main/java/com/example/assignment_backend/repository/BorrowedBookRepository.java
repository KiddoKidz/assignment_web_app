package com.example.assignment_backend.repository;

import com.example.assignment_backend.entity.BorrowedBook;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BorrowedBookRepository extends JpaRepository<BorrowedBook, Long> {
    @Query("SELECT bb FROM BorrowedBook bb WHERE UPPER(bb.book.title) LIKE UPPER(CONCAT('%', :title, '%'))")
    List<BorrowedBook> findByBook_TitleContainingIgnoreCase(@Param("title") String title);

    @Query("SELECT bb FROM BorrowedBook bb WHERE UPPER(bb.member.name) LIKE UPPER(CONCAT('%', :name, '%'))")
    List<BorrowedBook> findByMember_NameContainingIgnoreCase(@Param("name") String name);

    List<BorrowedBook> findByBorrowDate(LocalDate borrowDate);
}