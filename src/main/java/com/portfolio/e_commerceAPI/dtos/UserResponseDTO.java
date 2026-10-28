package com.portfolio.e_commerceAPI.dtos;

import com.portfolio.e_commerceAPI.entities.User;

public record UserResponseDTO(
        Long id,
        String name,
        String email,
        String role
) {
    public UserResponseDTO(User inputData) {
        this(
                inputData.getId(),
                inputData.getName(),
                inputData.getEmail(),
                inputData.getRole().name()
        );
    }
}
