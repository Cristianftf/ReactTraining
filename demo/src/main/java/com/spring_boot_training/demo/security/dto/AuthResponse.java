package com.spring_boot_training.demo.security.dto;

import io.micrometer.common.lang.NonNull;
import jakarta.validation.constraints.NotBlank;

public class AuthResponse {
    @NotBlank
    @NonNull
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
