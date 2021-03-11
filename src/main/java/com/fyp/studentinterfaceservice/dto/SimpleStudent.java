package com.fyp.studentinterfaceservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SimpleStudent {
    private Long studentId;
    private String firstName;
}