package com.spring_boot_training.demo.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.spring_boot_training.demo.model.User;
import com.spring_boot_training.demo.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;
    /**
     * Único método obligatorio de la interfaz.
     * Busca en la BD y devuelve un UserDetails (nuestra entidad User implementa UserDetails).
     *
     * @param username nombre de usuario con el que intentar autenticar
     * @return UserDetails del usuario encontrado
     * @throws UsernameNotFoundException si no existe el usuario
     */

     @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        //El authenticationManager llama a este metodo para obtener los detalles del usuario
        User user = userRepository.findByEmail(email)
        //lanza una excepcion si no encuentra el usuario 
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));
        
        return new CustomUserDetails(user); 
    }

}
