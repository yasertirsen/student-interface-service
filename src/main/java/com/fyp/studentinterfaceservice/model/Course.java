package com.fyp.studentinterfaceservice.model;

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
    private String name;
    private String university;
    private String level;
    private String url;
    private Set<Module> modules;
}
