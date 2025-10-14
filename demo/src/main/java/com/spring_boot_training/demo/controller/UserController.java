package com.spring_boot_training.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

import com.spring_boot_training.demo.dto.UserDto;
import com.spring_boot_training.demo.service.UserService;

import jakarta.validation.Valid;

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
    public void addUSer(@Valid @RequestBody UserDto userDto) {
        userService.addUser(userDto);         
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> changeRole(@PathVariable Long id, @RequestBody String rol) {
        userService.updateUserRole(id, rol);        
        return ResponseEntity.ok("Rol actualizado");
    }

    @DeleteMapping("/{id}")
    public String DeleteUser(long id) {
        userService.deleteUser(id);
        return "Usuario eliminado";
    }
    
    


}
