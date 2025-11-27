package com.example.assignment_backend.controller;

import com.example.assignment_backend.service.BorrowedBookService;
import com.example.assignment_backend.dto.BorrowedBookCreateDto;
import com.example.assignment_backend.dto.BorrowedBookResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;

@RestController
@RequestMapping("/api/borrowed-books")
@RequiredArgsConstructor
public class BorrowedBookController {
    private final BorrowedBookService service;

    @GetMapping
    public ResponseEntity<Page<BorrowedBookResponseDto>> getAllBorrowedBooks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String memberName,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate borrowDate,
            @PageableDefault(size = 10, sort = { "id" }, direction = Sort.Direction.ASC) Pageable pageable) {
        Page<BorrowedBookResponseDto> borrowedBooks = service.getAllBorrowedBooks(title, memberName, borrowDate,
                pageable);
        return ResponseEntity.ok(borrowedBooks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BorrowedBookResponseDto> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BorrowedBookResponseDto> create(@Valid @RequestBody BorrowedBookCreateDto dto) {
        BorrowedBookResponseDto saved = service.create(dto);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BorrowedBookResponseDto> update(@PathVariable Long id,
            @Valid @RequestBody BorrowedBookCreateDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
