package com.example.assignment_backend.service;

import com.example.assignment_backend.entity.BorrowedBook;
import com.example.assignment_backend.repository.BorrowedBookRepository;
import java.util.*;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.example.assignment_backend.dto.BorrowedBookCreateDto;
import com.example.assignment_backend.entity.Book;
import com.example.assignment_backend.entity.Member;
import com.example.assignment_backend.repository.BookRepository;
import com.example.assignment_backend.repository.MemberRepository;
import java.lang.RuntimeException;
import java.time.LocalDate;

import com.example.assignment_backend.dto.BorrowedBookResponseDto;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;
import com.example.assignment_backend.mapper.BookMapper;
import com.example.assignment_backend.mapper.MemberMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class BorrowedBookService {
    private final BorrowedBookRepository repository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final BookMapper bookMapper;
    private final MemberMapper memberMapper;

    private BorrowedBookResponseDto toBorrowedBookResponseDto(BorrowedBook borrowedBook) {
        return new BorrowedBookResponseDto(borrowedBook.getId(), borrowedBook.getBorrowDate(),
                borrowedBook.getReturnDate(), bookMapper.toBookResponseDto(borrowedBook.getBook()),
                memberMapper.toMemberResponseDto(borrowedBook.getMember()));
    }

    @Transactional(readOnly = true)
    public List<BorrowedBookResponseDto> getAllBorrowedBooks() {
        return repository.findAll().stream().map(this::toBorrowedBookResponseDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<BorrowedBookResponseDto> getAllBorrowedBooks(Pageable pageable) {
        return repository.findAll(pageable).map(this::toBorrowedBookResponseDto);
    }
    public Optional<BorrowedBookResponseDto> getById(Long id) {
        return repository.findById(id).map(this::toBorrowedBookResponseDto);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public BorrowedBookResponseDto create(BorrowedBookCreateDto dto) {
        Book book = bookRepository.findById(dto.getBookId()).orElseThrow(() -> new RuntimeException("Book not found"));
        Member member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));
        BorrowedBook borrowedBook = new BorrowedBook(null, book, member, dto.getBorrowDate(), dto.getReturnDate());
        return toBorrowedBookResponseDto(repository.save(borrowedBook));
    }

    public BorrowedBookResponseDto update(Long id, BorrowedBookCreateDto dto) {
        BorrowedBook existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("BorrowedBook not found with id: " + id));
        Book book = existing.getBook();
        if (dto.getBookId() != null) {
            book = bookRepository.findById(dto.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found with id: " + dto.getBookId()));
        }
        Member member = existing.getMember();
        if (dto.getMemberId() != null) {
            member = memberRepository.findById(dto.getMemberId())
                    .orElseThrow(() -> new RuntimeException("Member not found with id: " + dto.getMemberId()));
        }
        LocalDate borrowDate = dto.getBorrowDate() != null ? dto.getBorrowDate() : existing.getBorrowDate();
        LocalDate returnDate = dto.getReturnDate() != null ? dto.getReturnDate() : existing.getReturnDate();
        BorrowedBook updated = new BorrowedBook(existing.getId(), book, member, borrowDate, returnDate);
        return toBorrowedBookResponseDto(repository.save(updated));
    }

    public List<BorrowedBookResponseDto> search(String title, String memberName, LocalDate borrowDate) {
        List<BorrowedBook> results = repository.findAll();
        if (title != null && !title.trim().isEmpty()) {
            results.retainAll(repository.findByBook_TitleContainingIgnoreCase(title.trim()));
            System.out.println(results);
        }
        if (memberName != null && !memberName.trim().isEmpty()) {
            results.retainAll(repository.findByMember_NameContainingIgnoreCase(memberName.trim()));
        }
        if (borrowDate != null) {
            results.retainAll(repository.findByBorrowDate(borrowDate));
        }
        return results.stream().map(this::toBorrowedBookResponseDto).collect(Collectors.toList());
    }
}
