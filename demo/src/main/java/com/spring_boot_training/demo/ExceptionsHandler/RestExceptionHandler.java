package com.spring_boot_training.demo.ExceptionsHandler;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler {
   
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
        MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        // Recorre los FieldErrors generados por @Valid
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });
        
        // Devuelve 400 Bad Request y un JSON de errores
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

}
