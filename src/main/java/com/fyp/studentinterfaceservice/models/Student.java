package com.fyp.studentinterfaceservice.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Student {
    private long studentId;
    private String firstName;
    private String surname;
    private String email;
    private String password;
    private String username;
    private String phone;
    private String socialUrl;
    private Instant created;
    private boolean enabled;
    private Resume resume;
    private Course course;
    private Set<Skill> externalSkills;
}
