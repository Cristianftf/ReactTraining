package com.spring_boot_training.demo.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {     

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name="username", nullable = false)
    public String name;

    @Column(unique = true, nullable = false)
    public String email;

    public String password;

    public String rol;

    public User(String name, String email, String password, String rol) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.rol = rol;
    }

   


}
