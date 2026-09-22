package com.portfolio.e_commerceAPI.repositories;

import com.portfolio.e_commerceAPI.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category,Long> {
}
