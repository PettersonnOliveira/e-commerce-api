package com.portfolio.e_commerceAPI.entities;

import com.portfolio.e_commerceAPI.dtos.UserRequestDTO;
import com.portfolio.e_commerceAPI.dtos.UserUpdateDTO;
import com.portfolio.e_commerceAPI.entities.enums.Role;
import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    public User() {
    }

    public User(UserRequestDTO inputData) {
        this.name = inputData.name();
        this.email = inputData.email();
        this.password = inputData.password();
        this.role = inputData.role() != null ? inputData.role() : Role.USER;
    }

    public User(UserUpdateDTO inputData) {
        this.name = inputData.name();
        this.email = inputData.email();
        this.password = inputData.password();
        this.role = inputData.role();
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
