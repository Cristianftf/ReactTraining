package com.spring_boot_training.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.spring_boot_training.demo.dto.ChartDataDTO;
import com.spring_boot_training.demo.dto.StatsOverviewDTO;
import com.spring_boot_training.demo.repository.UserRepository;

public class StatsService {

     private final UserRepository userRepository;

    public StatsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public StatsOverviewDTO getOverviewStats() {
        long totalUsers = userRepository.count();
        long adminUsers = userRepository.countByRole("ADMIN");
        long regularUsers = userRepository.countByRole("USER");
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long recentSignups = userRepository.countByCreatedAtAfter(thirtyDaysAgo);

        return new StatsOverviewDTO(totalUsers, adminUsers, regularUsers, recentSignups);
    }

    public List<ChartDataDTO> getMonthlyChartStats() {
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        List<Object[]> results = userRepository.findMonthlyUserStats(sixMonthsAgo);

        return results.stream()
            .map(row -> {
                String monthName = ((String) row[0]).trim(); // "January   " → "January"
                long userCount = ((Number) row[1]).longValue();
                long adminCount = ((Number) row[2]).longValue();
                return new ChartDataDTO(monthName, userCount, adminCount);
            })
            .collect(Collectors.toList());
    }

}
