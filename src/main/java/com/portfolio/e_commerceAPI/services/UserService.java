package com.portfolio.e_commerceAPI.services;

import com.portfolio.e_commerceAPI.Exceptions.BusinessRuleException;
import com.portfolio.e_commerceAPI.Exceptions.ResourceNotFoundException;
import com.portfolio.e_commerceAPI.dtos.UserRequestDTO;
import com.portfolio.e_commerceAPI.dtos.UserResponseDTO;
import com.portfolio.e_commerceAPI.dtos.UserUpdateDTO;
import com.portfolio.e_commerceAPI.entities.User;
import com.portfolio.e_commerceAPI.entities.enums.Role;
import com.portfolio.e_commerceAPI.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    public final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO create(UserRequestDTO inputData) {
        if (userRepository.findByEmail(inputData.email()).isPresent()) {
            throw new BusinessRuleException("Email já cadastrado");
        }

        Role normalizedRole = normalizeRole(inputData.role());

        User user = new User(inputData);
        user.setRole(normalizedRole);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User userSalvo = userRepository.save(user);
        return new UserResponseDTO(userSalvo);
    }

    public List<UserResponseDTO> listAll() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(UserResponseDTO::new)
                .toList();
    }

    public UserResponseDTO findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        return new UserResponseDTO(user);
    }

    public UserResponseDTO update(Long id, UserUpdateDTO inputData) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (inputData.email() != null && !inputData.email().equals(user.getEmail())) {
            if (userRepository.findByEmail(inputData.email()).isPresent()) {
                throw new BusinessRuleException("Email já cadastrado");
            }
            user.setEmail(inputData.email());
        }

        if (inputData.name() != null) {
            user.setName(inputData.name());
        }

        if (inputData.password() != null) {
            user.setPassword(passwordEncoder.encode(inputData.password()));
        }

        if (inputData.role() != null) {
            user.setRole(normalizeRole(inputData.role()));
        }

        User userAtualizado = userRepository.save(user);
        return new UserResponseDTO(userAtualizado);
    }

    public void delete(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        userRepository.delete(user);
    }

    private Role normalizeRole(Role role) {
        if (role == null) {
            return Role.USER;
        }

        if (role == Role.ADMIN) {
            throw new BusinessRuleException("Não é permitido cadastrar ou atualizar usuários com perfil ADMIN pela API");
        }

        return role;
    }
}
