package com.portfolio.e_commerceAPI.dtos;

public record CartItemResponseDTO(
        Long id,
        Long productId,
        String productName,
        Double unitPrice,
        Integer quantity,
        Double subtotal
) {}
