package com.portfolio.e_commerceAPI.dtos;

import com.portfolio.e_commerceAPI.entities.Order;
import com.portfolio.e_commerceAPI.entities.OrderItem;
import com.portfolio.e_commerceAPI.entities.Product;

public record OrderItemResponseDTO(
        Long id,
        Integer quantity,
        Double price,
        OrderResponseDTO order,
        ProductResponseDTO product) {

    public OrderItemResponseDTO(OrderItem inputData) {
        this(inputData.getId(), inputData.getQuantity(), inputData.getPrice(),new OrderResponseDTO(inputData.getOrder()), new ProductResponseDTO(inputData.getProduct()));
    }
}
