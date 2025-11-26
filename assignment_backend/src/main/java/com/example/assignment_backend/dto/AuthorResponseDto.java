package com.example.assignment_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthorResponseDto {
    private Long id;
    private String name;
}