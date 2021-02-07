package com.fyp.studentinterfaceservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    private long reviewId;
    private String type;
    private String content;
    private String questions;
    private boolean hired;
    private boolean interviewed;
    private Long studentId;
}
