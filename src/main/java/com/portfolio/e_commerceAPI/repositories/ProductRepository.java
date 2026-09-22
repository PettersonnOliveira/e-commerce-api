package com.portfolio.e_commerceAPI.repositories;

import com.portfolio.e_commerceAPI.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product,Long> {
}
