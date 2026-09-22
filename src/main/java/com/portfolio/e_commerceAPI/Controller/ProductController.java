package com.portfolio.e_commerceAPI.Controller;

import com.portfolio.e_commerceAPI.dtos.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.portfolio.e_commerceAPI.ProductService;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductResponseDTO> criar(@RequestBody ProductRequestDTO inputData){
        ProductResponseDTO productResponseDTO = productService.create(inputData);
        return ResponseEntity.status(HttpStatus.CREATED).body(productResponseDTO);
    }
    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> listAll(){
        List<ProductResponseDTO> products = productService.listAll();
        return ResponseEntity.ok(products);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> findById(@PathVariable Long id){
        ProductResponseDTO productResponseDTO = productService.findById(id);
        return ResponseEntity.ok(productResponseDTO);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> update(@PathVariable Long id, @RequestBody ProductUpdateDTO inputData){
        ProductResponseDTO productResponseDTO = productService.update(id,inputData);
        return ResponseEntity.ok(productResponseDTO);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
