package com.fyp.studentinterfaceservice.exceptions;

public class UnauthenticatedUserException extends Exception {
    public UnauthenticatedUserException() {
        super();
    }

    public UnauthenticatedUserException(String message) {
        super(message);
    }
}
