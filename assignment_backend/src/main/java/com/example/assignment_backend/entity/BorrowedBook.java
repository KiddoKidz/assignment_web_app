package com.example.assignment_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.AccessLevel;
import java.time.LocalDate;

@Entity
@Table(name = "borrowed_books")
@Getter
@Setter(AccessLevel.PROTECTED)
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = { "book", "member" })
@EqualsAndHashCode(exclude = { "id", "book", "member" })
public class BorrowedBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private LocalDate borrowDate;

    private LocalDate returnDate;
}
