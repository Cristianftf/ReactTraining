package com.spring_boot_training.demo.service;

import com.spring_boot_training.demo.dto.UserDto;
import com.spring_boot_training.demo.model.User;
import com.spring_boot_training.demo.repository.UserRepository;
import org.springframework.data.domain.Pageable;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {  

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    

    UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUser(String name){ 
        return userRepository.findByName(name).orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Usuario con nombre " + name + " no encontrado"));
    }


    // Obtener todos los usuarios con paginación y ordenados por nombre
    public List<User> getAllUsers(){ 
        Pageable pageable = PageRequest.of(0, 10, Sort.by("name").ascending());
        return userRepository.findAll(pageable).getContent();

    }

    // Eliminar un usuario por su ID
    public void deleteUser(long id){
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Usuario con ID " + id + " no encontrado"
            );
        }

        userRepository.deleteById(id);
    }


   

    // Obtener usuarios por rol
    public List<User> getUsersByRole(String role){
        return userRepository.findUserByRoleList(role);
    }

    // Actualizar el rol de un usuario
    public void updateUserRole(long id, String role){
        User user = userRepository.findById(id);
        user.rol = role;
        userRepository.save(user);
    }

     public User addUser(UserDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo electrónico ya está registrado");
        }

        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        User user = new User(
            dto.getName(),
            dto.getEmail(),
            encodedPassword,
            dto.getRol() // "admin" o "user"
        );
        return userRepository.save(user);
    }

    public User updateUser(Long id, UserDto dto) {
        User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        // Validar que el email no esté en uso por otro usuario
        if (userRepository.existsByEmailAndIdNot(dto.getEmail(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo electrónico ya está registrado");
        }

        existingUser.setName(dto.getName());
        existingUser.setEmail(dto.getEmail());
        existingUser.setRol(dto.getRol());

        // Solo actualiza la contraseña si se proporciona
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return userRepository.save(existingUser);
    }


}