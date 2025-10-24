package com.spring_boot_training.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.spring_boot_training.demo.dto.ChartDataDTO;
import com.spring_boot_training.demo.dto.StatsOverviewDTO;
import com.spring_boot_training.demo.repository.UserRepository;

@Service 
public class StatsService {

     private final UserRepository userRepository;

    public StatsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public StatsOverviewDTO getOverviewStats() {
        long totalUsers = userRepository.count();
        long adminUsers = userRepository.countByRol("admin");
        long regularUsers = userRepository.countByRol("user");
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long recentSignups = userRepository.countByCreatedAtAfter(thirtyDaysAgo);

        return new StatsOverviewDTO(totalUsers, adminUsers, regularUsers, recentSignups);
    }

    public List<ChartDataDTO> getChartData() {
        LocalDate now = LocalDate.now();
        LocalDate sixMonthsAgo = now.minusMonths(5).withDayOfMonth(1);

        List<Object[]> results = userRepository.countUsersByMonth(sixMonthsAgo, now);

        if (results.isEmpty()) {
            System.out.println("⚠️ No hay datos de usuarios en el rango de fechas.");
        }

        return results.stream()
        .map(obj -> {
            YearMonth ym = YearMonth.of(
                    ((Number) obj[0]).intValue(),
                    ((Number) obj[1]).intValue()
            );

            String monthName = ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.of("es", "ES"));
            long usuarios = ((Number) obj[2]).longValue();
            long admins = ((Number) obj[3]).longValue();

            return new ChartDataDTO(monthName, usuarios, admins);
        })
        .collect(Collectors.toList());

    }


}
