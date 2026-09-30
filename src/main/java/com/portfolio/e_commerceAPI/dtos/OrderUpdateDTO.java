package com.portfolio.e_commerceAPI.dtos;

import com.portfolio.e_commerceAPI.entities.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderUpdateDTO(
        @NotNull(message = "O status do pedido é obrigatório")
        OrderStatus status
) {
}
