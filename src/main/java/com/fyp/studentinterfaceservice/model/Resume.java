package com.fyp.studentinterfaceservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Resume {
    private Long resumeId;
    private String name;
    private byte[] data;
    private Long studentId;

    public Resume(String name, byte[] data, Long studentId) {
        this.name = name;
        this.data = data;
        this.studentId = studentId;
    }
}
