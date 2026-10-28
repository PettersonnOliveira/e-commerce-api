package com.portfolio.e_commerceAPI.services;

import com.portfolio.e_commerceAPI.Exceptions.BusinessRuleException;
import com.portfolio.e_commerceAPI.Exceptions.ResourceNotFoundException;
import com.portfolio.e_commerceAPI.dtos.OrderResponseDTO;
import com.portfolio.e_commerceAPI.dtos.OrderUpdateDTO;
import com.portfolio.e_commerceAPI.entities.Cart;
import com.portfolio.e_commerceAPI.entities.CartItem;
import com.portfolio.e_commerceAPI.entities.Order;
import com.portfolio.e_commerceAPI.entities.OrderItem;
import com.portfolio.e_commerceAPI.entities.Product;
import com.portfolio.e_commerceAPI.entities.User;
import com.portfolio.e_commerceAPI.entities.enums.OrderStatus;
import com.portfolio.e_commerceAPI.repositories.CartItemRepository;
import com.portfolio.e_commerceAPI.repositories.CartRepository;
import com.portfolio.e_commerceAPI.repositories.OrderRepository;
import com.portfolio.e_commerceAPI.repositories.ProductRepository;
import com.portfolio.e_commerceAPI.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(
            OrderRepository orderRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponseDTO checkout(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuário não encontrado")
                );

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new BusinessRuleException("Carrinho não encontrado")
                );

        if (cart.getItems().isEmpty()) {
            throw new BusinessRuleException(
                    "Não é possível finalizar um carrinho vazio"
            );
        }

        Order order = new Order(user);

        for (CartItem cartItem : cart.getItems()) {

            Product product = productRepository.findById(
                    cartItem.getProduct().getId()
            ).orElseThrow(() ->
                    new ResourceNotFoundException("Produto não encontrado")
            );

            Integer quantity = cartItem.getQuantity();

            if (quantity == null || quantity <= 0) {
                throw new BusinessRuleException(
                        "Quantidade inválida para o produto: " + product.getName()
                );
            }

            if (product.getStock() < quantity) {
                throw new BusinessRuleException(
                        "Estoque insuficiente para o produto: " + product.getName()
                );
            }

            OrderItem orderItem = new OrderItem();

            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);

            // Registra o preço no momento da compra.
            orderItem.setPrice(product.getPrice());

            // Associa o item ao pedido.
            order.addItem(orderItem);

            // Desconta o estoque.
            product.setStock(product.getStock() - quantity);
        }

        // Salva o pedido e os itens por causa do CascadeType.ALL.
        Order savedOrder = orderRepository.save(order);

        // Limpa o carrinho após a criação do pedido.
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();

        return new OrderResponseDTO(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDTO> listAll(Long userId, boolean isAdmin) {

        List<Order> orders;

        if (isAdmin) {
            orders = orderRepository.findAll();
        } else {
            orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }

        return orders.stream()
                .map(OrderResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponseDTO findById(
            Long orderId,
            Long userId,
            boolean isAdmin
    ) {

        Order order;

        if (isAdmin) {
            order = orderRepository.findById(orderId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Pedido não encontrado")
                    );
        } else {
            order = orderRepository.findByIdAndUserId(orderId, userId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Pedido não encontrado")
                    );
        }

        return new OrderResponseDTO(order);
    }

    @Transactional
    public OrderResponseDTO update(
            Long id,
            OrderUpdateDTO inputData
    ) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Pedido não encontrado")
                );

        OrderStatus currentStatus = order.getStatus();
        OrderStatus newStatus = inputData.status();

        if (currentStatus == OrderStatus.SHIPPED
                || currentStatus == OrderStatus.CANCELLED) {

            throw new BusinessRuleException(
                    "Não é possível alterar um pedido finalizado ou cancelado"
            );
        }

        if (currentStatus == OrderStatus.PENDING) {

            if (newStatus != OrderStatus.PAID
                    && newStatus != OrderStatus.CANCELLED) {

                throw new BusinessRuleException(
                        "Um pedido pendente só pode ser pago ou cancelado"
                );
            }
        }

        if (currentStatus == OrderStatus.PAID) {

            if (newStatus != OrderStatus.SHIPPED
                    && newStatus != OrderStatus.CANCELLED) {

                throw new BusinessRuleException(
                        "Um pedido pago só pode ser enviado ou cancelado"
                );
            }
        }

        if (newStatus == OrderStatus.CANCELLED) {

            for (OrderItem item : order.getItems()) {

                Product product = item.getProduct();

                product.setStock(
                        product.getStock() + item.getQuantity()
                );
            }
        }

        order.setStatus(newStatus);

        Order updatedOrder = orderRepository.save(order);

        return new OrderResponseDTO(updatedOrder);
    }

    @Transactional
    public void delete(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Pedido não encontrado")
                );

        if (order.getStatus() != OrderStatus.CANCELLED) {
            throw new BusinessRuleException(
                    "Cancele o pedido antes de excluí-lo"
            );
        }

        orderRepository.delete(order);
    }
}