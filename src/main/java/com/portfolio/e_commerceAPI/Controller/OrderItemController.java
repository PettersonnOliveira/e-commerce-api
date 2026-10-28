package com.portfolio.e_commerceAPI.Controller;

import com.portfolio.e_commerceAPI.dtos.OrderItemRequestDTO;
import com.portfolio.e_commerceAPI.dtos.OrderItemResponseDTO;
import com.portfolio.e_commerceAPI.dtos.OrderItemUpdateDTO;
import com.portfolio.e_commerceAPI.services.OrderItemService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order-items")
@PreAuthorize("hasRole('ADMIN')")
@Tag(
        name = "Order Items",
        description = "Gerenciamento administrativo dos itens dos pedidos"
)
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @PostMapping
    public ResponseEntity<OrderItemResponseDTO> create(
            @RequestParam Long orderId,
            @RequestBody @Valid OrderItemRequestDTO inputData
    ) {

        OrderItemResponseDTO response =
                orderItemService.create(inputData, orderId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<OrderItemResponseDTO>> listAll() {

        return ResponseEntity.ok(orderItemService.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderItemResponseDTO> findById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(orderItemService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderItemResponseDTO> update(
            @PathVariable Long id,
            @RequestBody @Valid OrderItemUpdateDTO inputData
    ) {

        return ResponseEntity.ok(
                orderItemService.update(id, inputData)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        orderItemService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
