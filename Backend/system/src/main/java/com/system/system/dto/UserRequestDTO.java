package com.system.system.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserRequestDTO(

    String name,
    String lastname,
    LocalDate birth,
    @NotBlank @Email String email,
    String password,
    Boolean cadStatus,
    String razaoSocial,
    String bio) {
}
