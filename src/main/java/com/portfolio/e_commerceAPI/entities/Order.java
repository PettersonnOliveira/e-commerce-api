package com.portfolio.e_commerceAPI.entities;

import com.portfolio.e_commerceAPI.dtos.OrderRequestDTO;
import com.portfolio.e_commerceAPI.entities.enums.OrderStatus;
import com.portfolio.e_commerceAPI.dtos.OrderUpdateDTO;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private LocalDateTime createdAt;

    public Order(){
    }
    public Order(OrderRequestDTO inputData){
        this.status = OrderStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }
    public Order(OrderUpdateDTO inputData){
        this.status = OrderStatus.PENDING;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Order order = (Order) o;
        return Objects.equals(id, order.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
