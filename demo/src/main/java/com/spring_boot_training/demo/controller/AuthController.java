package com.spring_boot_training.demo.controller;


import com.spring_boot_training.demo.security.dto.AuthResponse;
import com.spring_boot_training.demo.security.dto.LoginRequest;
import com.spring_boot_training.demo.security.service.CustomUserDetailsService;
import com.spring_boot_training.demo.security.service.JwtService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
 

@RestController
@RequestMapping("/apiu/auth")
public class AuthController {
 private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService; // 👈 Inyecta el SERVICE

    public AuthController(
        AuthenticationManager authenticationManager,
        JwtService jwtService,
        CustomUserDetailsService customUserDetailsService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.customUserDetailsService = customUserDetailsService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        // 1. Autenticar (esto valida credenciales)
        authenticationManager.authenticate(
            
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // 2. Cargar detalles del usuario (para generar el token)
        UserDetails userDetails =
            customUserDetailsService.loadUserByUsername(request.getEmail()); // ✅ Correcto

        // 3. Generar token
        String jwtToken = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwtToken));
    }
}