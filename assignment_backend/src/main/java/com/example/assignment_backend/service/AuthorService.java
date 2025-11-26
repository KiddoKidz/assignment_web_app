package com.example.assignment_backend.service;

import com.example.assignment_backend.entity.Author;
import com.example.assignment_backend.repository.AuthorRepository;
import java.util.*;
import com.example.assignment_backend.dto.AuthorResponseDto;
import java.util.stream.Collectors;
import com.example.assignment_backend.dto.AuthorCreateDto;
import jakarta.persistence.EntityNotFoundException;
import com.example.assignment_backend.mapper.AuthorMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthorService {
    private final AuthorRepository repository;
    private final AuthorMapper authorMapper;

    public List<AuthorResponseDto> getAllAuthors() {
        return repository.findAll().stream().map(authorMapper::toAuthorResponseDto).collect(Collectors.toList());
    }

    public Page<AuthorResponseDto> getAllAuthors(Pageable pageable) {
        return repository.findAll(pageable).map(authorMapper::toAuthorResponseDto);
    }

    public Optional<AuthorResponseDto> getById(Long id) {
        return repository.findById(id).map(authorMapper::toAuthorResponseDto);
    }

    public AuthorResponseDto create(AuthorCreateDto dto) {
        Author author = new Author(null, dto.getName());
        Author saved = repository.save(author);
        return authorMapper.toAuthorResponseDto(saved);
    }

    public AuthorResponseDto update(Long id, AuthorCreateDto dto) {
        Author existing = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Author not found with id: " + id));
        Author updated = new Author(existing.getId(), dto.getName() != null ? dto.getName() : existing.getName());
        Author saved = repository.save(updated);
        return authorMapper.toAuthorResponseDto(saved);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
