package com.fyp.studentinterfaceservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Company {
    private long companyId;
    private String email;
    private String password;
    private String name;
    private String companyUrl;
    private String address;
    private String recruiter;
    private String recruiterPhone;
    private Instant created;
    private String role;
    private String[] authorities;
    private Boolean isLocked;
    private Long expiresIn;
    private String token;
    private boolean enabled;
    private boolean subscribed;
    private CompanyProfile profile;

    public Company(String name) {
        this.name = name;
    }
}
