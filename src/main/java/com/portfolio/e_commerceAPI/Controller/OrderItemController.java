package com.portfolio.e_commerceAPI.Controller;

import com.portfolio.e_commerceAPI.dtos.OrderItemResponseDTO;
import com.portfolio.e_commerceAPI.dtos.OrderItemUpdateDTO;
import com.portfolio.e_commerceAPI.dtos.OrderItemRequestDTO;
import com.portfolio.e_commerceAPI.services.OrderItemService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order-items")
@Tag(
        name = "Order Items",
        description = "Gerenciamento dos itens dos pedidos"
)
public class OrderItemController {
     private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @PostMapping
    public ResponseEntity<OrderItemResponseDTO> criar(@RequestBody @Valid OrderItemRequestDTO inputData){
        OrderItemResponseDTO orderItemResponseDTO = orderItemService.create(inputData);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderItemResponseDTO);
    }
    @GetMapping
    public ResponseEntity<List<OrderItemResponseDTO>> listAll(){
        List<OrderItemResponseDTO> orderItens = orderItemService.listAll();
        return ResponseEntity.ok(orderItens);
    }
    @GetMapping("/{id}")
    public ResponseEntity<OrderItemResponseDTO> findById(@PathVariable Long id){
        OrderItemResponseDTO orderItemResponseDTO = orderItemService.findById(id);
        return ResponseEntity.ok(orderItemResponseDTO);
    }
    @PutMapping("/{id}")
    public ResponseEntity<OrderItemResponseDTO> update(@PathVariable @Valid  Long id, @RequestBody OrderItemUpdateDTO inputData){
        OrderItemResponseDTO orderItemResponseDTO = orderItemService.update(id,inputData);
        return ResponseEntity.ok(orderItemResponseDTO);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderItemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
