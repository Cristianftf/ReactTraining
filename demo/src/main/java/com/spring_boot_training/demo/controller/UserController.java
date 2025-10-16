package com.spring_boot_training.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

import com.spring_boot_training.demo.dto.UserDto;
import com.spring_boot_training.demo.service.UserService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.spring_boot_training.demo.model.User;




@Controller
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    UserService userService;

    @GetMapping()
    public List<User> GetAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{name}")
    public User GetUser(String name) {
        return userService.getUser(name);
    }

     @PostMapping("/add")
    public ResponseEntity<User> createUser(@RequestBody  UserDto dto) {
        User newUser = userService.addUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody UserDto dto) {
        User updatedUser = userService.updateUser(id, dto);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        // 204 No Content: operación exitosa, sin cuerpo
        return ResponseEntity.noContent().build();
    }
    
    


}
