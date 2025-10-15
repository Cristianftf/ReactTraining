package com.spring_boot_training.demo.repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.spring_boot_training.demo.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByName(String name);
    Page<User> findAll(Pageable pageable);
    List<User> findByRol(String rol);
    Boolean existsByEmail(String email);
    Boolean existsByName(String name);
    Boolean existsById(long id);
}
