package com.example.assignment_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowedBookResponseDto {
    private Long id;
    private LocalDate borrowDate;
    private LocalDate returnDate;
    private BookResponseDto book;
    private MemberResponseDto member;
}