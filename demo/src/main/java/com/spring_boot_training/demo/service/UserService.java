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
        return userRepository.findByName(name);
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


    // Crear un nuevo usuario
    public User addUser(UserDto userdto){
        if(userRepository.existsByEmail(userdto.getEmail())){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El correo ya está en uso"
            );
        }
        String encocerdpassword=passwordEncoder.encode(userdto.getPassword());        
        User usuario = new User(userdto.getName(), userdto.getEmail(), encocerdpassword, userdto.getRol());        
        
        return userRepository.save(usuario);
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

    // Actualizar un usuario existente
    public User updateUser(long id, UserDto userDto) {
        User existingUser = userRepository.findById(id);
        if (existingUser == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Usuario con ID " + id + " no encontrado"
            );
        }

        if (userRepository.existsByEmailAndIdNot(userDto.getEmail(), id)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El correo ya está en uso por otro usuario"
            );
        }

        existingUser.setName(userDto.getName());
        existingUser.setEmail(userDto.getEmail());
        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(userDto.getPassword());
            existingUser.setPassword(encodedPassword);
        }
        existingUser.setRol(userDto.getRol());

        return userRepository.save(existingUser);
    }


}