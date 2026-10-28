package com.portfolio.e_commerceAPI.dtos;

import java.util.List;

public record CartResponseDTO(
        Long id,
        List<CartItemResponseDTO> items,
        Double total
) {}
