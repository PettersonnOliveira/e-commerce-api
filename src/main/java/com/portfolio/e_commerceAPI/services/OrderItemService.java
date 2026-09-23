package com.portfolio.e_commerceAPI.services;

import com.portfolio.e_commerceAPI.Exceptions.ResourceNotFoundException;
import com.portfolio.e_commerceAPI.dtos.OrderItemResponseDTO;
import com.portfolio.e_commerceAPI.dtos.OrderItemUpdateDTO;
import com.portfolio.e_commerceAPI.entities.Order;
import com.portfolio.e_commerceAPI.entities.OrderItem;
import com.portfolio.e_commerceAPI.dtos.OrderItemRequestDTO;
import com.portfolio.e_commerceAPI.entities.Product;
import com.portfolio.e_commerceAPI.repositories.OrderItemRepository;
import com.portfolio.e_commerceAPI.repositories.OrderRepository;
import com.portfolio.e_commerceAPI.repositories.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemService {
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderItemService(OrderItemRepository orderItemRepository, OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public OrderItemResponseDTO create(OrderItemRequestDTO inputData) {
        Long orderId = inputData.orderId();
        Long productId = inputData.productId();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order não encontrada"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product não encontrado"));

        OrderItem orderItem = new OrderItem(inputData);
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setPrice(product.getPrice());
        OrderItem orderItemSalvo = orderItemRepository.save(orderItem);
        return new OrderItemResponseDTO(orderItemSalvo);
    }

    public List<OrderItemResponseDTO> listAll(){
        List<OrderItem> orderItens = orderItemRepository.findAll();
        return orderItens.stream()
                .map(OrderItemResponseDTO::new)
                .toList();
    }
    public OrderItemResponseDTO findById(Long id){
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem não encontrado"));
        return new OrderItemResponseDTO(orderItem);
    }
    public OrderItemResponseDTO update(Long id, OrderItemUpdateDTO inputData){
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem não encontrado"));

        orderItem.setQuantity(inputData.quantity());

        OrderItem orderItemAtualizada = orderItemRepository.save(orderItem);

        return new OrderItemResponseDTO(orderItemAtualizada);
    }
    public void delete(Long id){
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem não encontrado"));
        orderItemRepository.delete(orderItem);
    }
}
