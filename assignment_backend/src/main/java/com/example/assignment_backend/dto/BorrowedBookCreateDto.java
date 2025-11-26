package com.example.assignment_backend.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowedBookCreateDto {
    @NotNull(message = "Book ID is required")
    @Positive(message = "Book ID must be positive")
    private Long bookId;

    @NotNull(message = "Member ID is required")
    @Positive(message = "Member ID must be positive")
    private Long memberId;

    @NotNull(message = "Borrow date is required")
    private LocalDate borrowDate;
    private LocalDate returnDate;
}