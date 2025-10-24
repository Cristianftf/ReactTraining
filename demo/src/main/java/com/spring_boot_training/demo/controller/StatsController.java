package com.spring_boot_training.demo.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring_boot_training.demo.dto.ChartDataDTO;
import com.spring_boot_training.demo.dto.StatsOverviewDTO;
import com.spring_boot_training.demo.service.StatsService;

@RestController
@RequestMapping("/api/stats")
public class StatsController {
@Autowired
StatsService statsService;
 public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/overview")
    
    public StatsOverviewDTO getOverview() {
        return statsService.getOverviewStats();
    }

    @GetMapping("/chart")
     
    public List<ChartDataDTO> getChartData() {
        return statsService.getChartData();
    }


    
        

}
