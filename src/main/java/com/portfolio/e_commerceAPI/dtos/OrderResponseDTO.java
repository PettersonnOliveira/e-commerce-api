package com.portfolio.e_commerceAPI.dtos;

import com.portfolio.e_commerceAPI.entities.enums.OrderStatus;
import com.portfolio.e_commerceAPI.entities.Order;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDTO(
        Long id,
        OrderStatus status,
        LocalDateTime createdAt,
        List<OrderItemSummaryDTO> items,
        Double total
) {
    public OrderResponseDTO(Order inputData) {
        this(inputData.getId(),inputData.getStatus(),inputData.getCreatedAt(),inputData.getItems().stream().map(OrderItemSummaryDTO::new).toList(),inputData.getTotal());
    }
}
