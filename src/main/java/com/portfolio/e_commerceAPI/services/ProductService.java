package com.portfolio.e_commerceAPI;

import com.portfolio.e_commerceAPI.Exceptions.ResourceNotFoundException;
import com.portfolio.e_commerceAPI.dtos.ProductRequestDTO;
import com.portfolio.e_commerceAPI.dtos.ProductResponseDTO;
import com.portfolio.e_commerceAPI.dtos.ProductUpdateDTO;
import com.portfolio.e_commerceAPI.entities.Category;
import com.portfolio.e_commerceAPI.entities.Product;
import com.portfolio.e_commerceAPI.repositories.CategoryRepository;
import com.portfolio.e_commerceAPI.repositories.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public ProductResponseDTO create(ProductRequestDTO inputData){
        Long categoryId = inputData.categoryId();
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        Product product = new Product(inputData);
        product.setCategory(category);
        Product productSalva = productRepository.save(product);
        return new ProductResponseDTO(productSalva);
    }
    public List<ProductResponseDTO> listAll(){
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(ProductResponseDTO::new)
                .toList();
    }
    public ProductResponseDTO findById(Long id){
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
        return new ProductResponseDTO(product);
    }
    public ProductResponseDTO update(Long id, ProductUpdateDTO inputData){
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));

        Category category = categoryRepository.findById(inputData.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        product.setName(inputData.name());
        product.setDescription(inputData.description());
        product.setPrice(inputData.price());
        product.setStock(inputData.stock());
        product.setCategory(category);

        Product productAtualizada = productRepository.save(product);

        return new ProductResponseDTO(productAtualizada);
    }
    public void delete(Long id){
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
        productRepository.delete(product);
    }
}
