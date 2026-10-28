package com.portfolio.e_commerceAPI.Controller;

import com.portfolio.e_commerceAPI.dtos.*;
import com.portfolio.e_commerceAPI.services.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    private Long getAuthenticatedUserId(Authentication authentication) {
        return (Long) authentication.getPrincipal();
    }

    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart(
            Authentication authentication
    ) {
        Long userId = getAuthenticatedUserId(authentication);

        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponseDTO> addItem(
            Authentication authentication,
            @RequestBody @Valid AddCartItemDTO inputData
    ) {
        Long userId = getAuthenticatedUserId(authentication);

        return ResponseEntity.ok(
                cartService.addItem(userId, inputData)
        );
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponseDTO> updateItem(
            Authentication authentication,
            @PathVariable Long itemId,
            @RequestBody @Valid UpdateCartItemDTO inputData
    ) {
        Long userId = getAuthenticatedUserId(authentication);

        return ResponseEntity.ok(
                cartService.updateItem(userId, itemId, inputData)
        );
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponseDTO> removeItem(
            Authentication authentication,
            @PathVariable Long itemId
    ) {
        Long userId = getAuthenticatedUserId(authentication);

        return ResponseEntity.ok(
                cartService.removeItem(userId, itemId)
        );
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(
            Authentication authentication
    ) {
        Long userId = getAuthenticatedUserId(authentication);

        cartService.clearCart(userId);

        return ResponseEntity.noContent().build();
    }
}
