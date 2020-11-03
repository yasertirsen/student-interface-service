package com.fyp.studentinterfaceservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Course {
    private long courseId;
    private String courseName;
    private String university;
    private int level;
    private Set<Module> modules;
}
