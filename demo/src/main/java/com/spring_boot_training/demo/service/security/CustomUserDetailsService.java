package com.spring_boot_training.demo.service.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.spring_boot_training.demo.model.CustomUserDetails;
import com.spring_boot_training.demo.model.User;
import com.spring_boot_training.demo.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user =userRepository.findByName(username).orElseThrow(() -> new UsernameNotFoundException("User not found with name: " + username));
        return new CustomUserDetails(user);
    }

}
