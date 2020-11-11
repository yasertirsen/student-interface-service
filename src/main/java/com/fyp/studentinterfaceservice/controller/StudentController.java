package com.fyp.studentinterfaceservice.controller;

import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.dto.AuthenticationResponse;
import com.fyp.studentinterfaceservice.dto.LoginRequest;
import com.fyp.studentinterfaceservice.dto.RefreshTokenRequest;
import com.fyp.studentinterfaceservice.dto.RegisterRequest;
import com.fyp.studentinterfaceservice.dto.Student;
import com.fyp.studentinterfaceservice.exceptions.StudentExceptionHandler;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@AllArgsConstructor
public class StudentController {

    private final ProgradClient client;

    @GetMapping("/all")
    public List<Student> getAllStudents() {
        return client.getAllStudents();
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
         return client.register(registerRequest);
    }

    @GetMapping("/verification/{token}")
    public ResponseEntity<?> verifyAccount(@PathVariable String token) {
        return new ResponseEntity<>(client.verifyAccount(token), HttpStatus.OK);
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody LoginRequest loginRequest) {
        return client.login(loginRequest);
    }

    @PostMapping("/refresh/token")
    public AuthenticationResponse refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        return client.refreshToken(refreshTokenRequest);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        return client.logout(refreshTokenRequest);
    }
}
