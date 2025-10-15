package com.spring_boot_training.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class securityConfig {
    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        // 1. Deshabilita CSRF para APIs REST

        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(authz -> authz

            // 2. Regla para DELETE: solo administradores

            .requestMatchers(HttpMethod.DELETE, "/api/v1/orders/**").hasRole("ADMIN")

            // 3. Regla para POST: solo usuarios autenticados
            .requestMatchers(HttpMethod.POST, "/api/v1/orders").authenticated()

            // 4. Regla para GET: acceso público (permitAll)
            .requestMatchers(HttpMethod.GET, "/api/v1/orders").permitAll()

            .requestMatchers(HttpMethod.GET, "/api/users").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/users/{name}").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/users/add").permitAll()
            .requestMatchers(HttpMethod.PUT, "/api/users/{id}").permitAll()
            .requestMatchers(HttpMethod.DELETE, "/api/users/{id}").permitAll()
             

            // 5. Cualquier otra petición requiere autenticación
            .anyRequest().authenticated()
        );
    // ... otros detalles como el login o manejo de excepciones
    return http.build();
}


}
