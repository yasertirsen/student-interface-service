package com.fyp.studentinterfaceservice.controller;


import com.fyp.studentinterfaceservice.exceptions.*;
import com.fyp.studentinterfaceservice.model.*;
import com.fyp.studentinterfaceservice.jwt.JWTTokenProvider;
import com.fyp.studentinterfaceservice.services.interfaces.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import static com.fyp.studentinterfaceservice.constant.SecurityConstants.EXPIRATION_TIME;

@RestController
public class StudentController {

    private final UserService userService;
    private final JWTTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;


    @Autowired
    public StudentController(UserService userService, JWTTokenProvider jwtTokenProvider, BCryptPasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @GetMapping("/all")
    public List<User> getAllStudents() {
        return userService.getAllStudents();
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) throws UsernameExistsException, UserNotFoundException, EmailExistsException, ProgradException {
         return userService.register(user);
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<User> login(@RequestBody User user) throws Exception {

        User loggedUser = userService.findUserByEmail(user.getEmail());
        if(passwordEncoder.matches(user.getPassword(), loggedUser.getPassword())) {
            authenticate(loggedUser.getEmail(), loggedUser.getPassword());
            UserPrincipal userPrincipal = new UserPrincipal(loggedUser);
            loggedUser.setExpiresIn(EXPIRATION_TIME);
            loggedUser.setToken(jwtTokenProvider.generateJwtToken(userPrincipal));

            return new ResponseEntity<>(loggedUser, HttpStatus.OK);
        }
        else
            throw new IncorrectPasswordException();

    }

    private void authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }

    @GetMapping("/currentUser")
    public User getCurrentUser() throws UnauthenticatedUserException, UserNotFoundException {
        return userService.getCurrentUser();
    }

    @GetMapping("/getUserById/{studentId}")
    public User getUserById(@PathVariable Long studentId) {
        return userService.findUserById(studentId);
    }

    @PutMapping("/update")
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }

    @GetMapping("/verification/{token}")
    public ResponseEntity<String> verifyAccount(@PathVariable String token) throws UserNotFoundException {
        return userService.verifyAccount(token);
    }

    @GetMapping("/sendVerify")
    public ResponseEntity<String> sendVerifyEmail(@RequestParam String email) throws UserNotFoundException, ProgradException {
        return userService.sendVerifyEmail(email);
    }

    @PutMapping("/changePassword/{token}")
    public User verifyChangePassword(@PathVariable String token, @RequestParam String password) throws UserNotFoundException {
        return userService.verifyChangePassword(token, password);
    }

    @PostMapping("/getSkillsNames")
    public List<String> getSkillsNames(@RequestBody UserProfile profile) {
        return userService.getSkillsNames(profile);
    }

    @PutMapping("/updateProfile")
    public UserProfile updateProfile(@RequestBody UserProfile profile) {
        return userService.updateProfile(profile);
    }

    @PostMapping("/upload/image/{userId}")
    public ResponseEntity<String> uploadImage(@RequestParam("imageFile") MultipartFile file, @PathVariable Long userId) throws IOException {
        return userService.uploadImage(file, userId);
    }

    @GetMapping("/getStudentAvatar/{userId}")
    public Image getImage(@PathVariable Long userId) {
        return userService.getImage(userId);
    }

    @GetMapping("/getAllSkills")
    public Set<Skill> getAllSkills() {
        return userService.getAllSkills();
    }

}
