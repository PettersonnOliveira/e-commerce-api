package com.portfolio.e_commerceAPI.repositories;

import com.portfolio.e_commerceAPI.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order,Long> {
}
