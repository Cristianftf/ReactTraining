package com.spring_boot_training.demo.repository;

import java.time.LocalDate;
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
            EXTRACT(YEAR FROM u.createdAt) AS year,
            EXTRACT(MONTH FROM u.createdAt) AS month,
            SUM(CASE WHEN u.rol = 'USER' THEN 1 ELSE 0 END) AS userCount,
            SUM(CASE WHEN u.rol = 'ADMIN' THEN 1 ELSE 0 END) AS adminCount
        FROM User u
        WHERE u.createdAt BETWEEN :startDate AND :endDate
        GROUP BY year, month
        ORDER BY year, month
    """)
    List<Object[]> countUsersByMonth(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
