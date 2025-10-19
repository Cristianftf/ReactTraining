package com.spring_boot_training.demo.security.dto;

public class AuthResponse {
    private String token;
    public AuthResponse(String token) {
        this.token = token;
    }
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    



}
