package com.portfolio.e_commerceAPI.repositories;

import com.portfolio.e_commerceAPI.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByIdAndCartId(Long itemId, Long cartId);

    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);
}
