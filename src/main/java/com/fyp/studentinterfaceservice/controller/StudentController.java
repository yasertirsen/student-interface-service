package com.fyp.studentinterfaceservice.controller;


import com.fyp.studentinterfaceservice.exceptions.*;
import com.fyp.studentinterfaceservice.model.Position;
import com.fyp.studentinterfaceservice.model.User;
import com.fyp.studentinterfaceservice.model.UserPrincipal;
import com.fyp.studentinterfaceservice.jwt.JWTTokenProvider;
import com.fyp.studentinterfaceservice.model.UserProfile;
import com.fyp.studentinterfaceservice.services.interfaces.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

            loggedUser.setPassword(StringUtils.EMPTY);
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
    public User getCurrentUser() throws UnauthenticatedUserException {
        return userService.getCurrentUser();
    }

    @PutMapping("/update")
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }

    @GetMapping("/verification/{token}")
    public ResponseEntity<String> verifyAccount(@PathVariable String token) {
        return userService.verifyAccount(token);
    }

    @GetMapping("/searchJobsApi/{location}/{keywords}")
    public List<Position> searchJobApi(@PathVariable String location, @PathVariable String keywords) {
        return userService.searchJobsApi(location, keywords);
    }

    @PostMapping("/getSkillsNames")
    public List<String> getSkillsNames(@RequestBody UserProfile profile) {
        return userService.getSkillsNames(profile);
    }

    @PutMapping("/updateProfile")
    public UserProfile updateProfile(@RequestBody UserProfile profile) {
        return userService.updateProfile(profile);
    }

    @PutMapping("/addSkills")
    public UserProfile addSkills(@RequestBody UserProfile profile) {
        return userService.addSkills(profile);
    }

}
