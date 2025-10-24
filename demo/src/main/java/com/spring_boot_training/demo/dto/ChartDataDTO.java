package com.spring_boot_training.demo.dto;

public class ChartDataDTO {
    private String name;
    private long usuarios;
    private long admins;

    public ChartDataDTO(String name, long usuarios, long admins) {
        this.name = name;
        this.usuarios = usuarios;
        this.admins = admins;
    }

    public String getName() {
        return name;
    }

    public long getUsuarios() {
        return usuarios;
    }

    public long getAdmins() {
        return admins;
    }

    
    

}
