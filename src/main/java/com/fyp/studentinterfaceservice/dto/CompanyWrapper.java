package com.fyp.studentinterfaceservice.dto;

import com.fyp.studentinterfaceservice.model.Company;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompanyWrapper {
    private Company company;
    private List<SimpleStudent> users;
}