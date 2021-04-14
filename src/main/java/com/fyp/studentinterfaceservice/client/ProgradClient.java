package com.fyp.studentinterfaceservice.client;

import com.fyp.studentinterfaceservice.dto.CompanyWrapper;
import com.fyp.studentinterfaceservice.exceptions.UserNotFoundException;
import com.fyp.studentinterfaceservice.model.*;
import feign.Headers;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@FeignClient(url = "${feign.url}", name = "${feign.student}")
public interface ProgradClient {

    String AUTH_TOKEN = "x-api-key";

    //Students endpoint

    @GetMapping("/students/all")
    List<User> getAllStudents(@RequestHeader(AUTH_TOKEN) String secretToken);

    @PostMapping("/students/add")
    User add(@RequestBody User user);

    @PutMapping("/students/update")
    User update(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestBody User user);

    @GetMapping(value = "/students/findByEmail")
    @Headers({"Content-Type: application/json"})
    ResponseEntity<User> findByEmail(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestParam String email) throws UserNotFoundException;

    @GetMapping(value = "/students/findByUsername")
    @Headers({"Content-Type: application/json"})
    ResponseEntity<User> findByUsername(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestParam String username);

    @GetMapping(value = "/students/findByToken")
    @Headers({"Content-Type: application/json"})
    ResponseEntity<User> findByToken(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestParam String token) throws UserNotFoundException;

    @PostMapping("/students/getSkillsNames")
    @Headers({"Content-Type: application/json"})
    List<String> getSkillsNames(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestBody UserProfile profile);

    @PutMapping(value = "/students/updateProfile", consumes = "application/json", produces="application/json")
    @ResponseBody
    UserProfile updateProfile(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestBody UserProfile profile);

    @GetMapping("/students/getAllSkills")
    Set<Skill> getAllSkills(@RequestHeader(AUTH_TOKEN) String secretToken);

    @GetMapping("/students/getById/{studentId}")
    User findById(@RequestHeader(AUTH_TOKEN) String secretToken, @PathVariable Long studentId);

    //Courses endpoint

    @GetMapping(value = "/courses/findById")
    @Headers({"Content-Type: application/json"})
    ResponseEntity<Course> findCourseById(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestParam Long id);

    @PostMapping("/courses/add")
    Course addCourse(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestBody Course course);

    @GetMapping("/courses/all")
    List<Course> getAllCourses(@RequestHeader(AUTH_TOKEN) String secretToken);

    @GetMapping(value = "/courses/existsByNameAndUniversity")
    boolean courseExistsByNameAndUniversity(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestBody Course course);

    @GetMapping(value = "/courses/findByNameAndUniversity")
    Course courseFindByNameAndUniversity(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestBody Course course);

    //Positions endpoint

    @GetMapping("/positions/all")
    List<Position> getAllPositions(@RequestHeader(AUTH_TOKEN) String secretToken);

    @GetMapping(value = "/positions/findById", produces = "application/json")
    Position findPositionById(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestParam Long id);

    @GetMapping(value= "/positions/getCompanyPositions/{companyId}", produces = "application/json")
    List<Position> getCompanyPositions(@RequestHeader(AUTH_TOKEN) String secretToken, @PathVariable Long companyId);

    @PostMapping("/positions/apply")
    ResponseEntity<String> apply(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestBody Application application);

    @GetMapping("/positions/getApplicationsByEmail")
    List<Application> getApplicationsByEmail(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestParam String email);

    @PutMapping("/positions/update")
    Position updatePosition(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestBody Position position);

    @PutMapping("/positions/application/update")
    Application updateApplication(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestBody Application application);

    @GetMapping("/positions/searchByTitle/{keywords}")
    List<Position> searchByJobsByTitle(@RequestHeader(AUTH_TOKEN) String secretToken, @PathVariable String keywords);

    //Companies endpoint

    @GetMapping("/companies/findByName")
    CompanyWrapper findCompanyByName(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestParam String name);

    @GetMapping("/companies/all")
    List<Company> getAllCompanies(@RequestHeader(AUTH_TOKEN) String secretToken);

    @PostMapping("/companies/review")
    Review review(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestBody Review review);

    @GetMapping("/companies/reviews")
    List<Review> getCompanyReviews(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestParam String name);

    @PutMapping("/companies/updateProfile")
    CompanyProfile updateCompanyProfile(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestBody CompanyProfile profile);

    @PostMapping("/companies/addToMailing")
    MailingList addToMailingList(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestParam Long companyId, @RequestParam String email);

    //files endpoint

    @PostMapping("/files/upload")
    ResponseEntity<String> uploadImage(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestBody Image img);

    @GetMapping("/files/getImage")
    Image getStudentAvatar(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestParam Long userId);

    @PostMapping(value = "/files/saveCv")
    Resume saveResume(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestBody Resume resume);

    @GetMapping("/files/getAllCvs/{userId}")
    List<Resume> getAllCvs(@RequestHeader(AUTH_TOKEN) String secretToken, @PathVariable Long userId);

    @PutMapping("/files/updateCv")
    Resume updateCv(@RequestHeader(AUTH_TOKEN) String secretToken, @RequestBody Resume resume);
}
