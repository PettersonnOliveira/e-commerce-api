package com.portfolio.e_commerceAPI.dtos;

import com.portfolio.e_commerceAPI.entities.Category;

public record CategoryResponseDTO(
        Long id,
        String name
) {
    public CategoryResponseDTO(Category inputData) {
        this(inputData.getId(), inputData.getName());
    }
}
