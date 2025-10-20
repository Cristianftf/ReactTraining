package com.spring_boot_training.demo.controller;


import com.spring_boot_training.demo.dto.UserDto;
import com.spring_boot_training.demo.security.dto.AuthResponse;
import com.spring_boot_training.demo.security.dto.LoginRequest;
import com.spring_boot_training.demo.security.service.CustomUserDetailsService;
import com.spring_boot_training.demo.security.service.JwtService;
import com.spring_boot_training.demo.service.UserService;

import java.util.HashMap;

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
    private final CustomUserDetailsService customUserDetailsService; 
    
    private final UserService userService;
    

    public AuthController(
        AuthenticationManager authenticationManager,
        JwtService jwtService,
        CustomUserDetailsService customUserDetailsService,
        UserService userService
        
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.customUserDetailsService = customUserDetailsService;
        this.userService = userService;
        
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // autenticar
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        // cargar userDetails
        UserDetails ud = customUserDetailsService.loadUserByUsername(request.getEmail());
        // generar token (puedes agregar roles y claims en el map)
        var extraClaims = new HashMap<String, Object>();
        String token = jwtService.generateToken(extraClaims, ud);
        return ResponseEntity.ok(new AuthResponse(token));
    }

     @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDto request) {        
       userService.addUser(request);                
        return ResponseEntity.ok("User registered successfully");        
    }


}