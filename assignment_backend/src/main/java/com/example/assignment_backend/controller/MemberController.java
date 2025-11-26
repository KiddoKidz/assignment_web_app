package com.example.assignment_backend.controller;

import com.example.assignment_backend.service.MemberService;
import com.example.assignment_backend.dto.MemberResponseDto;
import com.example.assignment_backend.dto.MemberCreateDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService service;

    @GetMapping
    public ResponseEntity<Page<MemberResponseDto>> getAllMembers(
            @PageableDefault(size = 10, sort = { "id" }, direction = Sort.Direction.ASC) Pageable pageable) {
        Page<MemberResponseDto> members = service.getAllMembers(pageable);
        return ResponseEntity.ok(members);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemberResponseDto> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MemberResponseDto> save(@Valid @RequestBody MemberCreateDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemberResponseDto> update(@PathVariable Long id, @Valid @RequestBody MemberCreateDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
