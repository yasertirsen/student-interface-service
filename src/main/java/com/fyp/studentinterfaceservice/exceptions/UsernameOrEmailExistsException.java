package com.fyp.studentinterfaceservice.exceptions;

public class UsernameOrEmailExistsException extends Exception {
    public UsernameOrEmailExistsException(String message) {
        super(message);
    }
}
