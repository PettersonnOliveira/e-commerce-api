package com.portfolio.e_commerceAPI.dtos;

public record LoginResponseDTO(
    String token,
    String type,
    Long userId,
    String name,
    String role
) {
    public LoginResponseDTO(String token, Long userId, String name, String role) {
        this(token, "Bearer", userId, name, role);
    }
}
