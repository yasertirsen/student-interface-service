package com.fyp.studentinterfaceservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationWrapper {
    private Map<String, Integer> statusData;
    private List<ApplicationPosition> applications;
}
