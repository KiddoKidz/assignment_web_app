package com.example.assignment_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberCreateDto {
    @NotBlank(message = "Name is required")
    private String name;
    private String email;
    private String phone;
}