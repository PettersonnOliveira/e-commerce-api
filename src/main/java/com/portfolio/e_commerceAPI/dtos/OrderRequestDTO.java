package com.portfolio.e_commerceAPI.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record OrderRequestDTO(
    @NotNull(message = "Itens do pedido são obrigatórios")
    @NotEmpty(message = "O pedido deve ter pelo menos um item")
    @Valid
    List<OrderItemRequestDTO> items
) {
}
