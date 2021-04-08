package com.fyp.studentinterfaceservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompanyProfile {
    private long profileId;
    private Set<Long> hiredStudents;
    private List<Review> reviews;
    private String bio;
}

