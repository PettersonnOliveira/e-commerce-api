package com.portfolio.e_commerceAPI.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record AddCartItemDTO(
        @NotNull Long productId,
        @NotNull @Positive Integer quantity
) {}
