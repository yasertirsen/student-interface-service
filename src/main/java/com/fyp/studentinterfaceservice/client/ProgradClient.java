package com.fyp.studentinterfaceservice.client;

import com.fyp.studentinterfaceservice.model.Course;
import com.fyp.studentinterfaceservice.model.User;
import feign.Headers;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@FeignClient(url = "${feign.url}", name = "${feign.student}")
public interface ProgradClient {

    String AUTH_TOKEN = "x-api-key";
    String bearerToken  = "development_token";

    //Students endpoint

    @GetMapping("/students/all")
    List<User> getAllStudents(@RequestHeader(AUTH_TOKEN) String bearerToken);

    @PostMapping("/students/add")
    User add(@RequestBody User user);

    @PutMapping("/students/update")
    User update(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestBody User user);

    @GetMapping(value = "/students/findByEmail")
    @Headers({"Content-Type: application/json"})
    ResponseEntity<User> findByEmail(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestParam String email);

    @GetMapping(value = "/students/findByUsername")
    @Headers({"Content-Type: application/json"})
    ResponseEntity<User> findByUsername(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestParam String username);

    @GetMapping(value = "/students/findByToken")
    @Headers({"Content-Type: application/json"})
    ResponseEntity<User> findByToken(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestParam String token);

    //Courses endpoint

    @GetMapping(value = "/courses/findById")
    @Headers({"Content-Type: application/json"})
    ResponseEntity<Course> findCourseById(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestParam Long id);

    @PostMapping("/courses/add")
    Course addCourse(@RequestBody Course course);

    @GetMapping(value = "/courses/existsByNameAndUniversity")
    boolean courseExistsByNameAndUniversity(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestBody Course course);

    @GetMapping(value = "/courses/findByNameAndUniversity")
    Course courseFindByNameAndUniversity(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestBody Course course);

}
