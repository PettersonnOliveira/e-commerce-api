package com.portfolio.e_commerceAPI.services;

import com.portfolio.e_commerceAPI.dtos.*;
import com.portfolio.e_commerceAPI.entities.*;
import com.portfolio.e_commerceAPI.repositories.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    private Cart getOrCreateCart(Long userId) {

        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {

                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "Usuário não encontrado"
                            ));

                    return cartRepository.save(new Cart(user));
                });
    }

    @Transactional(readOnly = true)
    public CartResponseDTO getCart(Long userId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElse(null);

        if (cart == null) {
            return new CartResponseDTO(null, List.of(), 0.0);
        }

        return toResponseDTO(cart);
    }

    @Transactional
    public CartResponseDTO addItem(Long userId, AddCartItemDTO inputData) {

        Cart cart = getOrCreateCart(userId);

        Product product = productRepository.findById(inputData.productId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Produto não encontrado"
                ));

        if (inputData.quantity() > product.getStock()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Quantidade solicitada maior que o estoque disponível"
            );
        }

        CartItem item = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);

        if (item != null) {

            int newQuantity = item.getQuantity() + inputData.quantity();

            if (newQuantity > product.getStock()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Quantidade total maior que o estoque disponível"
                );
            }

            item.setQuantity(newQuantity);

        } else {

            item = new CartItem(cart, product, inputData.quantity());
            cart.getItems().add(item);
        }

        cartItemRepository.save(item);

        return toResponseDTO(cart);
    }

    @Transactional
    public CartResponseDTO updateItem(
            Long userId,
            Long itemId,
            UpdateCartItemDTO inputData
    ) {

        Cart cart = getOrCreateCart(userId);

        CartItem item = cartItemRepository
                .findByIdAndCartId(itemId, cart.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Item não encontrado no carrinho"
                ));

        if (inputData.quantity() > item.getProduct().getStock()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Quantidade solicitada maior que o estoque disponível"
            );
        }

        item.setQuantity(inputData.quantity());

        return toResponseDTO(cart);
    }

    @Transactional
    public CartResponseDTO removeItem(Long userId, Long itemId) {

        Cart cart = getOrCreateCart(userId);

        CartItem item = cartItemRepository
                .findByIdAndCartId(itemId, cart.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Item não encontrado no carrinho"
                ));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return toResponseDTO(cart);
    }

    @Transactional
    public void clearCart(Long userId) {

        Cart cart = getOrCreateCart(userId);

        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
    }

    private CartResponseDTO toResponseDTO(Cart cart) {

        List<CartItemResponseDTO> items = cart.getItems()
                .stream()
                .map(item -> {

                    Double subtotal =
                            item.getProduct().getPrice() * item.getQuantity();

                    return new CartItemResponseDTO(
                            item.getId(),
                            item.getProduct().getId(),
                            item.getProduct().getName(),
                            item.getProduct().getPrice(),
                            item.getQuantity(),
                            subtotal
                    );
                })
                .toList();

        Double total = items.stream()
                .mapToDouble(CartItemResponseDTO::subtotal)
                .sum();

        return new CartResponseDTO(
                cart.getId(),
                items,
                total
        );
    }
}
