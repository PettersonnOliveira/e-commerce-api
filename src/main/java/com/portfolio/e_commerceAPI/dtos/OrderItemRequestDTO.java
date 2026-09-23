package com.portfolio.e_commerceAPI.dtos;

public record OrderItemRequestDTO(
        Integer quantity,
        Long orderId,
        Long productId
) {
}
