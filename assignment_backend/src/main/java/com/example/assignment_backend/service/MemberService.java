package com.example.assignment_backend.service;

import com.example.assignment_backend.entity.Member;
import com.example.assignment_backend.repository.MemberRepository;
import java.util.*;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.example.assignment_backend.dto.MemberResponseDto;
import java.util.stream.Collectors;
import com.example.assignment_backend.dto.MemberCreateDto;
import com.example.assignment_backend.mapper.MemberMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository repository;
    private final MemberMapper memberMapper;

    public List<MemberResponseDto> getAllMembers() {
        return repository.findAll().stream().map(memberMapper::toMemberResponseDto).collect(Collectors.toList());
    }

    public Page<MemberResponseDto> getAllMembers(Pageable pageable) {
        return repository.findAll(pageable).map(memberMapper::toMemberResponseDto);
    }

    public Optional<MemberResponseDto> getById(Long id) {
        return repository.findById(id).map(memberMapper::toMemberResponseDto);
    }

    public MemberResponseDto create(MemberCreateDto dto) {
        Member member = new Member(null, dto.getName(), dto.getEmail(), dto.getPhone());
        member = repository.save(member);
        return memberMapper.toMemberResponseDto(member);
    }

    public MemberResponseDto update(Long id, MemberCreateDto dto) {
        Member existing = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with id: " + id));
        Member updated = new Member(
                existing.getId(),
                dto.getName() != null ? dto.getName() : existing.getName(),
                dto.getEmail() != null ? dto.getEmail() : existing.getEmail(),
                dto.getPhone() != null ? dto.getPhone() : existing.getPhone());
        Member saved = repository.save(updated);
        return memberMapper.toMemberResponseDto(saved);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
