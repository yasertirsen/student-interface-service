package com.fyp.studentinterfaceservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Experience {
    private Long experienceId;
    private String company;
    private String role;
    private String description;
    private String begin;
    private String end;
    private String location;
    private boolean voluntary;
}
