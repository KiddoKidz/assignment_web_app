package com.example.assignment_backend.mapper;

import com.example.assignment_backend.dto.BookResponseDto;
import com.example.assignment_backend.entity.Book;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookMapper {
    private final AuthorMapper authorMapper;

    public BookResponseDto toBookResponseDto(Book book) {
        return new BookResponseDto(book.getId(), book.getTitle(), book.getCategory(), book.getPublishingYear(),
                authorMapper.toAuthorResponseDto(book.getAuthor()));
    }
}
