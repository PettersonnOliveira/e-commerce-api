package com.portfolio.e_commerceAPI.dtos;

import com.portfolio.e_commerceAPI.entities.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UserUpdateDTO(
        String name,

        @Email(message = "Email inválido")
        String email,

        @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
        String password,

        Role role
) {
}
