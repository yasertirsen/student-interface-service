package com.fyp.studentinterfaceservice.exceptions;

import com.fyp.studentinterfaceservice.dto.HttpCustomResponse;
import feign.FeignException;
import feign.RetryableException;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.net.ConnectException;
import java.nio.file.AccessDeniedException;
import java.util.Objects;

import static com.fyp.studentinterfaceservice.constants.ErrorConstants.*;
import static org.springframework.http.HttpStatus.*;

@RestControllerAdvice
public class StudentExceptionHandler {


    @ExceptionHandler(FeignException.class)
    public ResponseEntity<HttpCustomResponse> handleFeignStatusException(FeignException e) {

        ResponseEntity<HttpCustomResponse> toReturn = illegalStateException();

        switch (e.status()) {
            case 400:
                toReturn = invalidDataFormat();
                break;
            case 401:
                toReturn = invalidCredentials();
                break;
            case 403:
                toReturn = accessDeniedException();
                break;
//            case 423:
//                toReturn = accountLockedException();
//                break;
            case 409:
                toReturn = usernameOrEmailExistsException();
                break;
            case 500:
                toReturn = internalServerErrorException();
        }
        return toReturn;
    }

    @ExceptionHandler(UsernameOrEmailExistsException.class)
    public ResponseEntity<HttpCustomResponse> usernameOrEmailExistsException() {
        return createHttpResponse(CONFLICT, USERNAME_OR_EMAIL_EXISTS);
    }

    @ExceptionHandler(RetryableException.class)
    public ResponseEntity<HttpCustomResponse> retryableException() {
        return createHttpResponse(GATEWAY_TIMEOUT, SERVER_COULD_NOT_BE_REACH);
    }


    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<HttpCustomResponse> illegalStateException() {
        return createHttpResponse(NOT_IMPLEMENTED, UNEXPECTED_VALUE);
    }

//    @ExceptionHandler(DisabledException.class)
//    public ResponseEntity<HttpCustomResponse> accountDisabledException() {
//        return createHttpResponse(FORBIDDEN, ACCOUNT_DISABLED);
//    }
//
//    @ExceptionHandler(LockedException.class)
//    public ResponseEntity<HttpCustomResponse> accountLockedException() {
//        return createHttpResponse(LOCKED, ACCOUNT_LOCKED);
//    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<HttpCustomResponse> accessDeniedException() {
        return createHttpResponse(FORBIDDEN, NOT_ENOUGH_PERMISSION);
    }

//    @ExceptionHandler(TokenExpiredException.class)
//    public ResponseEntity<HttpCustomResponse> tokenExpiredException(TokenExpiredException e) {
//        return createHttpResponse(UNAUTHORIZED, e.getMessage());
//    }


    @ExceptionHandler(InvalidDataFormatException.class)
    public ResponseEntity<HttpCustomResponse> invalidDataFormat() {
        return createHttpResponse(BAD_REQUEST, INVALID_DATA_FORMAT);
    }


    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<HttpCustomResponse> invalidCredentials() {
        return createHttpResponse(UNAUTHORIZED, INVALID_CREDENTIALS);
    }


    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<HttpCustomResponse> methodNotSupportedException(HttpRequestMethodNotSupportedException exception) {
        HttpMethod supportedMethod = Objects.requireNonNull(exception.getSupportedHttpMethods()).iterator().next();
        return createHttpResponse(METHOD_NOT_ALLOWED, String.format(METHOD_IS_NOT_ALLOWED, supportedMethod));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<HttpCustomResponse> internalServerErrorException() {
        return createHttpResponse(INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
    }


    private ResponseEntity<HttpCustomResponse> createHttpResponse(HttpStatus httpStatus, String message) {
        HttpCustomResponse httpCustomResponse = new HttpCustomResponse(httpStatus.value(), httpStatus, httpStatus.getReasonPhrase().toUpperCase(), message);

        return new ResponseEntity<>(httpCustomResponse, httpStatus);
    }

}
