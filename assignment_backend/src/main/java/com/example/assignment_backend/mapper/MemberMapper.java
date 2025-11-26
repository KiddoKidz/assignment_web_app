package com.example.assignment_backend.mapper;

import com.example.assignment_backend.dto.MemberResponseDto;
import com.example.assignment_backend.entity.Member;
import org.springframework.stereotype.Component;

@Component
public class MemberMapper {
    public MemberResponseDto toMemberResponseDto(Member member) {
        return new MemberResponseDto(member.getId(), member.getName(), member.getEmail(), member.getPhone());
    }
}
