package com.fyp.studentinterfaceservice.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Skill {
    private long skillId;
    private String skillName;
    private Industry industry;
}

