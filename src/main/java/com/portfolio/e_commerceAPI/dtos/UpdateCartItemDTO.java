package com.portfolio.e_commerceAPI.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateCartItemDTO(
        @NotNull @Positive Integer quantity
) {}
