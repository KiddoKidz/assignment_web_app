package com.example.assignment_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookResponseDto {
    private Long id;
    private String title;
    private String category;
    private Integer publishingYear;
    private AuthorResponseDto author;
}