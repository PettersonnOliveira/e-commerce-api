package com.portfolio.e_commerceAPI.entities;

import com.portfolio.e_commerceAPI.dtos.CategoryRequestDTO;
import com.portfolio.e_commerceAPI.dtos.CategoryUpdateDTO;
import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    public Category(){
    }

    public Category(CategoryRequestDTO inputData){
        this.name = inputData.name();
    }
    public Category(CategoryUpdateDTO inputData){
        this.name = inputData.name();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Category category = (Category) o;
        return Objects.equals(id, category.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
