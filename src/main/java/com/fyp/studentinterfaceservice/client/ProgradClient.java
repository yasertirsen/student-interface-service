package com.fyp.studentinterfaceservice.client;

import com.fyp.studentinterfaceservice.model.*;
import feign.Headers;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

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

    @GetMapping("/students/getAllSkills")
    Set<Skill> getAllSkills(@RequestHeader(AUTH_TOKEN) String bearerToken);

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

    @GetMapping(value= "/positions/getCompanyPositions/{companyId}", produces = "application/json")
    List<Position> getCompanyPositions(@RequestHeader(AUTH_TOKEN) String bearerToken, @PathVariable Long companyId);

    @PostMapping("/positions/apply")
    ResponseEntity<String> apply(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestBody Application application);

    @PostMapping("/positions/getApplicationsByEmail")
    List<Application> getApplicationsByEmail(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestParam String email);

    //Companies endpoint

    @GetMapping("/companies/findByName")
    Company findCompanyByName(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestParam String name);

    @GetMapping("/companies/all")
    List<Company> getAllCompanies(@RequestHeader(AUTH_TOKEN) String bearerToken);

    @PostMapping("/companies/review")
    Review review(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestBody Review review);

    @GetMapping("/companies/reviews")
    List<Review> getCompanyReviews(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestParam String name);

    @PutMapping("/companies/updateProfile")
    CompanyProfile updateCompanyProfile(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestBody CompanyProfile profile);

    //files endpoint

    @PostMapping("/files/upload")
    ResponseEntity<String> uploadImage(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestBody Image img);

    @GetMapping("/files/getImage")
    Image getStudentAvatar(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestParam Long userId);

    @PostMapping(value = "/files/saveCv")
    Resume saveResume(@RequestHeader(AUTH_TOKEN) String bearerToken, @RequestBody Resume resume);
}
