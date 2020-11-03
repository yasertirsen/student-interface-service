package com.fyp.studentinterfaceservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Module {
    private long moduleId;
    private String moduleName;
    private Skill moduleSkill;
}
