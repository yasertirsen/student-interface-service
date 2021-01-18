package com.fyp.studentinterfaceservice.client;

import com.fyp.studentinterfaceservice.model.Course;
import com.fyp.studentinterfaceservice.model.Position;
import com.fyp.studentinterfaceservice.model.User;
import com.fyp.studentinterfaceservice.model.UserProfile;
import feign.Headers;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/students/getSkillsNames")
    @Headers({"Content-Type: application/json"})
    List<String> getSkillsNames(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestBody UserProfile profile);

    @PutMapping(value = "/students/updateProfile", consumes = "application/json", produces="application/json")
    @ResponseBody
    UserProfile updateProfile(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestBody UserProfile profile);

    //Courses endpoint

    @GetMapping(value = "/courses/findById")
    @Headers({"Content-Type: application/json"})
    ResponseEntity<Course> findCourseById(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestParam Long id);

    @PostMapping("/courses/add")
    Course addCourse(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestBody Course course);

    @GetMapping("/courses/all")
    List<Course> getAllCourses(@RequestHeader(AUTH_TOKEN) String bearerToken);

    @GetMapping(value = "/courses/existsByNameAndUniversity")
    boolean courseExistsByNameAndUniversity(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestBody Course course);

    @GetMapping(value = "/courses/findByNameAndUniversity")
    Course courseFindByNameAndUniversity(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestBody Course course);

    //Positions endpoint

    @GetMapping("/positions/all")
    List<Position> getAllPositions(@RequestHeader(AUTH_TOKEN) String bearerToken);

    @GetMapping(value = "/positions/findById", produces = "application/json")
    Position findPositionById(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestParam Long id);
}
