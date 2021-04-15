package com.fyp.studentinterfaceservice.model;

import lombok.Getter;

import static com.fyp.studentinterfaceservice.constant.Authority.ADMIN_AUTHORITIES;
import static com.fyp.studentinterfaceservice.constant.Authority.USER_AUTHORITIES;

@Getter
public enum Role {

    ROLE_USER(USER_AUTHORITIES),
    ROLE_ADMIN(ADMIN_AUTHORITIES);

    private final String[] authorities;

    Role(String... authorities) {
        this.authorities = authorities;
    }

    public String[] getAuthorities() {
        return authorities;
    }

}
