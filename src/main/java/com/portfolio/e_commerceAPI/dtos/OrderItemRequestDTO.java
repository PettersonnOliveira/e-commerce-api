package com.portfolio.e_commerceAPI.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record OrderItemRequestDTO(
        @NotNull(message = "A quantidade é obrigatória")
        @Positive(message = "A quantidade deve ser maior que zero")
        Integer quantity,

        @NotNull(message = "O pedido é obrigatório")
        Long orderId,

        @NotNull(message = "O produto é obrigatório")
        Long productId
) {
}
