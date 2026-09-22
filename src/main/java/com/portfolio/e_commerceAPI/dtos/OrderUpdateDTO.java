package com.portfolio.e_commerceAPI.dtos;

import com.portfolio.e_commerceAPI.entities.enums.OrderStatus;

public record OrderUpdateDTO(
        OrderStatus status
) {
}
