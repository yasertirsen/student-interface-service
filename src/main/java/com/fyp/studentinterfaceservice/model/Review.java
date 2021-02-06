package com.fyp.studentinterfaceservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    private long reviewId;
    private String reviewType;
    private String reviewContent;
    private Long companyId;
    private Long studentId;
}
