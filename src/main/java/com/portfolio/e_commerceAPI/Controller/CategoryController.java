package com.portfolio.e_commerceAPI.Controller;

import com.portfolio.e_commerceAPI.dtos.CategoryRequestDTO;
import com.portfolio.e_commerceAPI.dtos.CategoryResponseDTO;
import com.portfolio.e_commerceAPI.dtos.CategoryUpdateDTO;
import com.portfolio.e_commerceAPI.services.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }
    @PostMapping
    public ResponseEntity<CategoryResponseDTO> criar(@RequestBody CategoryRequestDTO inputData){
        CategoryResponseDTO categoryResponseDTO = categoryService.create(inputData);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryResponseDTO);
    }
    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> listAll(){
        List<CategoryResponseDTO> categories = categoryService.listAll();
        return ResponseEntity.ok(categories);
    }
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> findById(@PathVariable Long id){
        CategoryResponseDTO categoryResponseDTO = categoryService.findById(id);
        return ResponseEntity.ok(categoryResponseDTO);
    }
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> update(@PathVariable Long id, @RequestBody CategoryUpdateDTO inputData){
        CategoryResponseDTO categoryResponseDTO = categoryService.update(id,inputData);
        return ResponseEntity.ok(categoryResponseDTO);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
