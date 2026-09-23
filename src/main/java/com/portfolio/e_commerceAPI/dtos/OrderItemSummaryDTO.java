package com.portfolio.e_commerceAPI.dtos;

import com.portfolio.e_commerceAPI.entities.OrderItem;

public record OrderItemSummaryDTO(
        Long id,
        Integer quantity,
        Double price,
        Long productId,
        String productName
) {
    public OrderItemSummaryDTO(OrderItem inputData) {
        this(inputData.getId(), inputData.getQuantity(), inputData.getPrice(), inputData.getProduct().getId(), inputData.getProduct().getName());
    }
}
