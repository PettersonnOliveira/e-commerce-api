package com.portfolio.e_commerceAPI.services;

import com.portfolio.e_commerceAPI.Exceptions.ResourceNotFoundException;
import com.portfolio.e_commerceAPI.dtos.CategoryRequestDTO;
import com.portfolio.e_commerceAPI.dtos.CategoryResponseDTO;
import com.portfolio.e_commerceAPI.dtos.CategoryUpdateDTO;
import com.portfolio.e_commerceAPI.entities.Category;
import com.portfolio.e_commerceAPI.repositories.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    public final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CategoryResponseDTO create(CategoryRequestDTO inputData){
        Category category = new Category(inputData);
        Category categorySalva = categoryRepository.save(category);
        return new CategoryResponseDTO(categorySalva);
    }
    public List<CategoryResponseDTO> listAll(){
       List<Category> categories = categoryRepository.findAll();
       return categories.stream()
               .map(CategoryResponseDTO::new)
               .toList();
    }
    public CategoryResponseDTO findById(Long id){
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        return new CategoryResponseDTO(category);
    }
    public CategoryResponseDTO update(Long id, CategoryUpdateDTO inputData){
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        category.setName(inputData.name());

        Category categoryAtualizada = categoryRepository.save(category);
        return new CategoryResponseDTO(categoryAtualizada);
    }
    public void delete(Long id){
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        categoryRepository.delete(category);
    }
}
