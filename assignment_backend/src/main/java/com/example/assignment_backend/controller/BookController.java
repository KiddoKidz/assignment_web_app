package com.example.assignment_backend.controller;

import com.example.assignment_backend.dto.BookCreateDto;
import com.example.assignment_backend.dto.BookResponseDto;
import com.example.assignment_backend.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {
    private final BookService service;

    @GetMapping
    public ResponseEntity<Page<BookResponseDto>> getAllBooks(
            @PageableDefault(size = 10, sort = { "id" }, direction = Sort.Direction.ASC) Pageable pageable) {
        Page<BookResponseDto> books = service.getAllBooks(pageable);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDto> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BookResponseDto> create(@Valid @RequestBody BookCreateDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookResponseDto> update(@PathVariable Long id, @Valid @RequestBody BookCreateDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
