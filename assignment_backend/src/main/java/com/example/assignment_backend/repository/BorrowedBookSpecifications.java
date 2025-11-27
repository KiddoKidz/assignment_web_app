package com.example.assignment_backend.repository;

import com.example.assignment_backend.entity.BorrowedBook;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.JoinType;
import java.time.LocalDate;

public class BorrowedBookSpecifications {

    public static Specification<BorrowedBook> hasTitle(String title) {
        return (root, query, criteriaBuilder) -> {
            if (title == null || title.trim().isEmpty()) {
                return null;
            }
            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.join("book", JoinType.LEFT).get("title")),
                    "%" + title.toLowerCase().trim() + "%");
        };
    }

    public static Specification<BorrowedBook> hasMemberName(String memberName) {
        return (root, query, criteriaBuilder) -> {
            if (memberName == null || memberName.trim().isEmpty()) {
                return null;
            }
            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.join("member", JoinType.LEFT).get("name")),
                    "%" + memberName.toLowerCase().trim() + "%");
        };
    }

    public static Specification<BorrowedBook> hasBorrowDate(LocalDate borrowDate) {
        return (root, query, criteriaBuilder) -> {
            return borrowDate != null ? criteriaBuilder.equal(root.get("borrowDate"), borrowDate) : null;
        };
    }
}