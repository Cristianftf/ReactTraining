package com.spring_boot_training.demo.config;
import com.spring_boot_training.demo.security.service.JwtService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.spring_boot_training.demo.security.service.CustomUserDetailsService;
import com.spring_boot_training.demo.security.service.JwtAuthenticationEntryPoint;
import com.spring_boot_training.demo.security.service.JwtAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class securityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    private final JwtService jwtService;
     private final JwtAuthenticationEntryPoint entryPoint;


    securityConfig(JwtService jwtService, CustomUserDetailsService customUserDetailsService,JwtAuthenticationEntryPoint entryPoint) {
        this.jwtService = jwtService;
        this.customUserDetailsService = customUserDetailsService;
        this.entryPoint = entryPoint;


    }

  
// ✅ Expone el AuthenticationManager como bean
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // ✅ Filtro de autenticación JWT
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtService,customUserDetailsService);
    }




    // ✅ PasswordEncoder (necesario para login)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    } 





    // ✅ Configuración de CORS
    //esto se utiliza para permitir que el frontend acceda al backend sin problemas de CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }




    // ✅ Configuración básica de seguridad (ajusta según tus necesidades)
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex->ex.authenticationEntryPoint(entryPoint))
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/apiu/auth/**").permitAll()  // Permite acceso a login
                .requestMatchers("/api/users/add").permitAll() // Permite registro sin autenticación
                .requestMatchers("/api/users/**").permitAll()  // Temporal: permite acceso a usuarios
                .requestMatchers("/api/stats/**").permitAll()  // Temporal: permite acceso a stats
                .anyRequest().permitAll()  // Temporal: permite todo
            );
            //esto es para agregar el filtro antes del filtro de autenticación por defecto
            http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}