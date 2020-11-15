package com.fyp.studentinterfaceservice.exceptions;

public class UsernameExistsException extends Exception {

    public UsernameExistsException() {
    }

    public UsernameExistsException(String message) {
        super(message);
    }
}
