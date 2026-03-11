package com.system.system.dto;

import java.time.LocalDate;

public record UserResponseDTO(
    Long id,
    String name,
    String lastname,
    String email,
    String razaoSocial,
    LocalDate createdAt,
    String bio) {
}