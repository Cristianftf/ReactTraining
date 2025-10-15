package com.spring_boot_training.demo.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Estatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public int totalUsers;
    public int adminUsers;
    public int regularUsers;
    public int recentSignups;


}
