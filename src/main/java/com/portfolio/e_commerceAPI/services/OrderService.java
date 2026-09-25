package com.portfolio.e_commerceAPI.services;

import com.portfolio.e_commerceAPI.Exceptions.BusinessRuleException;
import com.portfolio.e_commerceAPI.Exceptions.ResourceNotFoundException;
import com.portfolio.e_commerceAPI.dtos.OrderRequestDTO;
import com.portfolio.e_commerceAPI.dtos.OrderResponseDTO;
import com.portfolio.e_commerceAPI.dtos.OrderUpdateDTO;
import com.portfolio.e_commerceAPI.entities.Order;
import com.portfolio.e_commerceAPI.entities.enums.OrderStatus;
import com.portfolio.e_commerceAPI.repositories.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }


    public OrderResponseDTO create(OrderRequestDTO inputData) {
        Order order = new Order(inputData);
        Order orderSalva = orderRepository.save(order);
        return new OrderResponseDTO(orderSalva);
    }
    public List<OrderResponseDTO> listAll(){
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(OrderResponseDTO::new)
                .toList();
    }
    public OrderResponseDTO findById(Long id){
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("order não encontrada"));

        return new OrderResponseDTO(order);
    }
    public OrderResponseDTO update(Long id, OrderUpdateDTO inputData){
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("order não encontrada"));

        if (order.getStatus() == OrderStatus.SHIPPED) {
            throw new BusinessRuleException("nao é possivel realizar essa atualizaçao");
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BusinessRuleException("nao é possivel realizar essa atualizaçao");
        }
        if (order.getStatus() == OrderStatus.PENDING) {
            if(inputData.status() != OrderStatus.PAID && inputData.status() != OrderStatus.CANCELLED){
                throw new BusinessRuleException("nao é possivel realizar essa atualizaçao");
            }
        }
        if (order.getStatus() == OrderStatus.PAID) {
            if(inputData.status() != OrderStatus.SHIPPED && inputData.status() != OrderStatus.CANCELLED){
                throw new BusinessRuleException("nao é possivel realizar essa atualizaçao");
            }
        }
        order.setStatus(inputData.status());

        Order orderAtualizado = orderRepository.save(order);
        return new OrderResponseDTO(orderAtualizado);
    }
    public void delete(Long id){
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("order não encontrada"));
        orderRepository.delete(order);
    }
}