package com.spring_boot_training.demo.dto;


public class StatsOverviewDTO {
    private long totalUsers;
    private long adminUsers;
    private long regularUsers;
    private long recentSignups; // últimos 30 días

    // Constructor
    public StatsOverviewDTO(long totalUsers, long adminUsers, long regularUsers, long recentSignups) {
        this.totalUsers = totalUsers;
        this.adminUsers = adminUsers;
        this.regularUsers = regularUsers;
        this.recentSignups = recentSignups;
    }

    // Getters (no necesitas setters si es solo para lectura)
    public long getTotalUsers() { return totalUsers; }
    public long getAdminUsers() { return adminUsers; }
    public long getRegularUsers() { return regularUsers; }
    public long getRecentSignups() { return recentSignups; }

}
