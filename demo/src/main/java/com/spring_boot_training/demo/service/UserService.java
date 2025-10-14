package com.spring_boot_training.demo.service;

import com.spring_boot_training.demo.dto.UserDto;
import com.spring_boot_training.demo.model.User;
import com.spring_boot_training.demo.repository.UserRepository;
import org.springframework.data.domain.Pageable;


import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {  

    private final UserRepository userRepository;
    

    UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUser(String name){ 
        return userRepository.findByName(name);
    }


    public List<User> getAllUsers(){ 
        Pageable pageable = PageRequest.of(0, 10, Sort.by("name").ascending());
        return userRepository.findAll(pageable).getContent();

    }
    public void deleteUser(long id){
        userRepository.deleteById(id);
    }

    public User addUser(UserDto userdto){
        
        User usuario = new User(userdto.getName(), userdto.getEmail(), userdto.getPassword(), userdto.getRol());        
        userRepository.save(usuario);
        return ResponseEntity.ok(usuario).getBody();
    }

    public List<User> getUsersByRole(String role){
        return userRepository.findUserByRoleList(role);
    }

    public void updateUserRole(long id, String role){
        User user = userRepository.findById(id);
        user.rol = role;
        userRepository.save(user);
    }


}