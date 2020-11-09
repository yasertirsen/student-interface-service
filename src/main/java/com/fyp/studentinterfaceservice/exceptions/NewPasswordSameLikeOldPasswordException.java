package com.fyp.studentinterfaceservice.exceptions;

public class NewPasswordSameLikeOldPasswordException extends Exception {

    public NewPasswordSameLikeOldPasswordException(String message) {
        super(message);
    }
}
