package com.spring_boot_training.demo.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.spring_boot_training.demo.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    
    User findByName(String name);

    boolean existsByEmail(String email);

    
    boolean existsByEmailAndIdNot(String email, Long id);
    
    User findById(long id);
    
    void deleteById(long id);
    
    List<User> findUserByRoleList(String role);
    
    Boolean existsByName(String name);

    Boolean existsById(long id);

    Long countByRole(String role);

    long countByCreatedAtAfter(LocalDateTime date);

    @Query("""
        SELECT 
            FUNCTION('to_char', u.createdAt, 'Month') AS monthName,
            COUNT(CASE WHEN u.role = 'USER' THEN 1 END) AS userCount,
            COUNT(CASE WHEN u.role = 'ADMIN' THEN 1 END) AS adminCount
        FROM User u
        WHERE u.createdAt >= :sixMonthsAgo
        GROUP BY FUNCTION('to_char', u.createdAt, 'Month'), FUNCTION('date_trunc', 'month', u.createdAt)
        ORDER BY FUNCTION('date_trunc', 'month', u.createdAt)
    """)
    List<Object[]> findMonthlyUserStats(@Param("sixMonthsAgo") LocalDateTime sixMonthsAgo);

}
