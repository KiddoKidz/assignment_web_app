package com.example.assignment_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookCreateDto {
    @NotBlank(message = "Title is required")
    private String title;
    private String category;
    private Integer publishingYear;

    @NotNull(message = "Author ID is required")
    @Positive(message = "Author ID must be positive")
    private Long authorId;
}