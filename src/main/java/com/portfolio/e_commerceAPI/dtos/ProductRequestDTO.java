package com.portfolio.e_commerceAPI.dtos;

public record ProductRequestDTO(
        String name,
        String description,
        Double price,
        Integer stock,
        Long categoryId
) {
}
