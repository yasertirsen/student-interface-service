package com.fyp.studentinterfaceservice.client;

import com.fyp.studentinterfaceservice.dto.AuthenticationResponse;
import com.fyp.studentinterfaceservice.dto.LoginRequest;
import com.fyp.studentinterfaceservice.dto.RefreshTokenRequest;
import com.fyp.studentinterfaceservice.dto.RegisterRequest;
import com.fyp.studentinterfaceservice.dto.Student;
import feign.Headers;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import javax.validation.Valid;
import java.util.List;

@FeignClient(url = "${feign.url}", name = "${feign.student}")
public interface StudentClient {
//
//    String AUTH_TOKEN = "x-api-key";
//    String bearerToken  = "development_token";
//
//    @PutMapping(value = "/all")
//    @Headers({"Content-Type: application/json"})
//    public ResponseEntity<User> login(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestBody User user);

    @GetMapping("/all")
    List<Student> getAllStudents();
    @PostMapping("/register")
    ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest);
    @GetMapping("/verification/{token}")
    String verifyAccount(@PathVariable String token);
    @PostMapping("/login")
    AuthenticationResponse login(@RequestBody LoginRequest loginRequest);
    @PostMapping("/refresh/token")
    AuthenticationResponse refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest);
    @PostMapping("/logout")
    ResponseEntity<String> logout(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest);
}
