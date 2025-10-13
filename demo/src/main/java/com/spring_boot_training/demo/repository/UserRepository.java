package com.spring_boot_training.demo.repository;

import java.awt.print.Pageable;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.spring_boot_training.demo.model.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{
    User findByEmail(String email);
    User findByName(String name);
    User findById(long id);
    List<User> findAll(Pageable pageable);
    void deleteById(long id);
    User save(User user);
    List<User> findUserByRoleList(String role);
    Boolean existsByEmail(String email);
    Boolean existsByName(String name);
    Boolean existsById(long id);

}
