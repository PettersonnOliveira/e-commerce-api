package com.portfolio.e_commerceAPI.dtos;

import com.portfolio.e_commerceAPI.entities.Product;

public record ProductResponseDTO(
        Long id,
        String name,
        String description,
        Double price,
        Integer stock,
        CategoryResponseDTO category
) {
    public ProductResponseDTO(Product inputData) {
        this(inputData.getId(), inputData.getName(), inputData.getDescription(), inputData.getPrice(), inputData.getStock(), new CategoryResponseDTO(inputData.getCategory()));
    }
}
