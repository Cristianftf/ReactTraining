package com.spring_boot_training.demo.security.service;

import java.util.HashMap;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

/**
 * Servicio responsable de:
 * - Generar tokens JWT
 * - Extraer información (claims) del token
 * - Validar token (firma, expiración y pertenencia al usuario)
 *
 * Usa JJWT (io.jsonwebtoken).
 */
@Service
public class JwtService {
    @Value("${jwt.secret}")  
    private String SECRET_KEY;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    private Key signingKey;

    //esto es para inicializar la clave de firma después de inyectar SECRET_KEY
    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        signingKey = Keys.hmacShaKeyFor(keyBytes);
    }
    // Validación básica: username y expiración (mantener método único validateToken)
    // Nota: isTokenValid es un alias usado internamente si es necesario.
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractEmail(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }


    
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }


    // Extrae un claim específico del token JWT usando una función de resolución de claims
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Genera un token JWT para el usuario dado, sin claims adicionales
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }


    //Genera un token con claims adicionales
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        long now = System.currentTimeMillis();
        return Jwts
            .builder()
            .setClaims(extraClaims)
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date(now))
            .setExpiration(new Date(now + jwtExpirationMs))
            .signWith(getSignInKey(), SignatureAlgorithm.HS256)
            .compact();
    }



    // alias para compatibilidad: mantener isTokenValid que delega en validateToken
    public boolean isTokenValid(String token, UserDetails userDetails) {
        return validateToken(token, userDetails);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
            .parserBuilder()
            .setSigningKey(getSignInKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    private Key getSignInKey() {
        // prefer the precomputed signingKey inicializado en @PostConstruct
        if (signingKey != null) return signingKey;
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        signingKey = Keys.hmacShaKeyFor(keyBytes);
        return signingKey;
    }

}
