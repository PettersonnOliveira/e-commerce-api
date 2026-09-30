package com.portfolio.e_commerceAPI.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record ProductUpdateDTO(
        @NotBlank(message = "O nome do produto é obrigatório")
        String name,

        @NotBlank(message = "A descrição do produto é obrigatória")
        String description,

        @PositiveOrZero(message = "O preço não pode ser negativo")
        Double price,

        @PositiveOrZero(message = "O estoque não pode ser negativo")
        Integer stock,

        @NotNull(message = "A categoria é obrigatória")
        Long categoryId
) {
}
