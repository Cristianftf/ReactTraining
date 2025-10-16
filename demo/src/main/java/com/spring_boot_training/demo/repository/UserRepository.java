package com.spring_boot_training.demo.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.spring_boot_training.demo.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    Optional <User> findByName(String name);
    

    boolean existsByEmail(String email);

    
    boolean existsByEmailAndIdNot(String email, Long id);
    
   
    List<User> findByRol(String rol);
    
    

    
    Boolean existsByName(String name);

    Boolean existsById(long id);

    
    Long countByRol(String rol);

    long countByCreatedAtAfter(LocalDateTime date);

    @Query("""
        SELECT 
            FUNCTION('to_char', u.createdAt, 'Month') AS monthName,
            COUNT(CASE WHEN u.rol = 'USER' THEN 1 END) AS userCount,
            COUNT(CASE WHEN u.rol = 'ADMIN' THEN 1 END) AS adminCount
        FROM User u
        WHERE u.createdAt >= :sixMonthsAgo
        GROUP BY FUNCTION('to_char', u.createdAt, 'Month'), FUNCTION('date_trunc', 'month', u.createdAt)
        ORDER BY FUNCTION('date_trunc', 'month', u.createdAt)
    """)
    List<Object[]> findMonthlyUserStats(@Param("sixMonthsAgo") LocalDateTime sixMonthsAgo);

}
