package com.portfolio.e_commerceAPI.Controller;

import com.portfolio.e_commerceAPI.dtos.OrderResponseDTO;
import com.portfolio.e_commerceAPI.dtos.OrderUpdateDTO;
import com.portfolio.e_commerceAPI.services.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@Tag(
        name = "Orders",
        description = "Gerenciamento de pedidos"
)
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    private Long getAuthenticatedUserId(Authentication authentication) {
        return (Long) authentication.getPrincipal();
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority -> authority.equals("ROLE_ADMIN"));
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponseDTO> checkout(
            Authentication authentication
    ) {

        Long userId = getAuthenticatedUserId(authentication);

        OrderResponseDTO order = orderService.checkout(userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(order);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> listAll(
            Authentication authentication
    ) {

        Long userId = getAuthenticatedUserId(authentication);

        boolean admin = isAdmin(authentication);

        List<OrderResponseDTO> orders =
                orderService.listAll(userId, admin);

        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> findById(
            @PathVariable Long id,
            Authentication authentication
    ) {

        Long userId = getAuthenticatedUserId(authentication);

        boolean admin = isAdmin(authentication);

        OrderResponseDTO order =
                orderService.findById(id, userId, admin);

        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponseDTO> update(
            @PathVariable Long id,
            @RequestBody @Valid OrderUpdateDTO inputData
    ) {

        OrderResponseDTO order =
                orderService.update(id, inputData);

        return ResponseEntity.ok(order);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        orderService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
