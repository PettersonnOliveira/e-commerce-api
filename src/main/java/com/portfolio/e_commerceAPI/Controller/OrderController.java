package com.portfolio.e_commerceAPI.Controller;

import com.portfolio.e_commerceAPI.dtos.*;
import com.portfolio.e_commerceAPI.services.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponseDTO> criar(@RequestBody OrderRequestDTO inputData){
        OrderResponseDTO orderResponseDTO = orderService.create(inputData);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderResponseDTO);
    }
    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> listAll(){
        List<OrderResponseDTO> order = orderService.listAll();
        return ResponseEntity.ok(order);
    }
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> findById(@PathVariable Long id){
        OrderResponseDTO orderResponseDTO = orderService.findById(id);
        return ResponseEntity.ok(orderResponseDTO);
    }
    @PutMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> update(@PathVariable Long id, @RequestBody OrderUpdateDTO inputData){
        OrderResponseDTO orderResponseDTO = orderService.update(id,inputData);
        return ResponseEntity.ok(orderResponseDTO);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
