package com.example.assignment_backend.service;

import com.example.assignment_backend.entity.Book;
import com.example.assignment_backend.entity.Author;
import com.example.assignment_backend.dto.BookCreateDto;
import com.example.assignment_backend.repository.BookRepository;
import com.example.assignment_backend.repository.AuthorRepository;
import java.util.*;
import java.util.stream.Collectors;
import com.example.assignment_backend.dto.BookResponseDto;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.example.assignment_backend.mapper.BookMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository repository;
    private final AuthorRepository authorRepository;
    private final BookMapper bookMapper;

    public List<BookResponseDto> getAllBooks() {
        return repository.findAll().stream().map(bookMapper::toBookResponseDto).collect(Collectors.toList());
    }

    public Page<BookResponseDto> getAllBooks(Pageable pageable) {
        return repository.findAll(pageable).map(bookMapper::toBookResponseDto);
    }

    public Optional<BookResponseDto> getById(Long id) {
        return repository.findById(id).map(bookMapper::toBookResponseDto);
    }

    public BookResponseDto create(BookCreateDto dto) {
        Author author = authorRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + dto.getAuthorId()));
        Book book = new Book(null, dto.getTitle(), dto.getCategory(), dto.getPublishingYear(), author);
        Book saved = repository.save(book);
        return bookMapper.toBookResponseDto(saved);
    }

    public BookResponseDto update(Long id, BookCreateDto dto) {
        Book existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        Author author = existing.getAuthor();
        if (dto.getAuthorId() != null) {
            author = authorRepository.findById(dto.getAuthorId())
                    .orElseThrow(() -> new RuntimeException("Author not found with id: " + dto.getAuthorId()));
        }
        Book book = new Book(existing.getId(), dto.getTitle(), dto.getCategory(), dto.getPublishingYear(), author);
        Book saved = repository.save(book);
        return bookMapper.toBookResponseDto(saved);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
