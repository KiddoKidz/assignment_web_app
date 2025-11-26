package com.example.assignment_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.AccessLevel;

import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "authors")
@Getter
@Setter(AccessLevel.PROTECTED)
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode(exclude = "id")
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;
}
