package com.spring_boot_training.demo.dto;

public class ChartDataDTO {
    private String name;
    private Long usuarios;
    private Long admins;


    
    public ChartDataDTO() {
    }

    
    public ChartDataDTO(String name, Long usuarios, Long admins) {
        this.name = name;
        this.usuarios = usuarios;
        this.admins = admins;
    }


    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Long getUsuarios() {
        return usuarios;
    }
    public void setUsuarios(Long usuarios) {
        this.usuarios = usuarios;
    }
    public Long getAdmins() {
        return admins;
    }
    public void setAdmins(Long admins) {
        this.admins = admins;
    }

    

}
