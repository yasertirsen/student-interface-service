package com.fyp.studentinterfaceservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Application {
    private Long applicationId;
    private String fullName;
    private String email;
    private Resume resume;
    private Long positionId;
}
