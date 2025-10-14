package com.spring_boot_training.demo.repository;

import java.util.List;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.spring_boot_training.demo.model.User;

import io.micrometer.common.lang.NonNull;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{
    User findByEmail(String email);
    User findByName(String name);
    User findById(long id);
    List<User> findAll(Pageable pageable);
    void deleteById(long id);
    User save(@NonNull User user);
    List<User> findUserByRoleList(String role);
    Boolean existsByEmail(String email);
    Boolean existsByName(String name);
    Boolean existsById(long id);

}
