package com.portfolio.e_commerceAPI.dtos;

import com.portfolio.e_commerceAPI.entities.enums.OrderStatus;
import com.portfolio.e_commerceAPI.entities.Order;

import java.time.LocalDateTime;

public record OrderResponseDTO(
        Long id,
        OrderStatus status,
        LocalDateTime createdAt
) {
    public OrderResponseDTO(Order inputData) {
        this(inputData.getId(),inputData.getStatus(),inputData.getCreatedAt());
    }
}
