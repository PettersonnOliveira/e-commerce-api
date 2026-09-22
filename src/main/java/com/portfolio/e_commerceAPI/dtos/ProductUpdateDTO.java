package com.portfolio.e_commerceAPI.dtos;

public record ProductUpdateDTO(
        String name,
        String description,
        Double price,
        Integer stock,
        Long categoryId
) {

}
