package com.portfolio.e_commerceAPI.entities;

import com.portfolio.e_commerceAPI.dtos.ProductUpdateDTO;
import com.portfolio.e_commerceAPI.dtos.ProductRequestDTO;
import jakarta.persistence.*;

import java.util.Objects;
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    public Product(){
    }

    public Product(ProductRequestDTO inputData) {
        this.name = inputData.name();
        this.description = inputData.description();
        this.price = inputData.price();
        this.stock = inputData.stock();
    }
    public Product(ProductUpdateDTO inputData) {
        this.name = inputData.name();
        this.description = inputData.description();
        this.price = inputData.price();
        this.stock = inputData.stock();
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return Objects.equals(id, product.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
