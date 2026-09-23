package com.portfolio.e_commerceAPI.repositories;

import com.portfolio.e_commerceAPI.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
