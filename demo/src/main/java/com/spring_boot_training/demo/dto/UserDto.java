package com.spring_boot_training.demo.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;


public class UserDto {
    
    
    @NotBlank(message = "El nombre no puede estar vacío")
    public String name;

    @Email(message = "Debe ser un correo válido")
    public String email;

    @NotBlank(message = "La contraseña no puede estar vacía")
    public String password;
    
    public String rol;    

    

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

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    

    
    
}
