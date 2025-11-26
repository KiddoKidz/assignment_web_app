package com.example.assignment_backend.mapper;

import com.example.assignment_backend.dto.AuthorResponseDto;
import com.example.assignment_backend.entity.Author;
import org.springframework.stereotype.Component;

@Component
public class AuthorMapper {
    public AuthorResponseDto toAuthorResponseDto(Author author) {
        return new AuthorResponseDto(author.getId(), author.getName());
    }
}
