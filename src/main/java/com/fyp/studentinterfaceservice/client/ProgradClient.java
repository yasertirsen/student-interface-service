package com.fyp.studentinterfaceservice.client;

import com.fyp.studentinterfaceservice.models.Student;
import com.fyp.studentinterfaceservice.models.User;
import feign.Headers;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@FeignClient(url = "${feign.url}", name = "${feign.student}")
public interface ProgradClient {

    String AUTH_TOKEN = "x-api-key";
    String bearerToken  = "development_token";

//    @PutMapping(value = "/all")
//    @Headers({"Content-Type: application/json"})
//    public ResponseEntity<User> login(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestBody User user);

    @GetMapping("/all")
    List<Student> getAllStudents();

    @PostMapping("/register")
    User register(@RequestBody User user);

//    @GetMapping("/verification/{token}")
//    ResponseEntity<String> verifyAccount(@PathVariable String token);

    @PostMapping("/login")
    User login(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestBody User user);


    @GetMapping(value = "/findByEmail")
    @Headers({"Content-Type: application/json"})
    ResponseEntity<User> findByEmail(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestParam String email);

    @GetMapping(value = "/findByUsername")
    @Headers({"Content-Type: application/json"})
    ResponseEntity<User> findByUsername(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestParam String username);
}
