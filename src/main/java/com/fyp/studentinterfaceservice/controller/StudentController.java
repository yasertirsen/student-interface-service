package com.fyp.studentinterfaceservice.controller;


import com.fyp.studentinterfaceservice.exceptions.EmailExistsException;
import com.fyp.studentinterfaceservice.exceptions.ProgradException;
import com.fyp.studentinterfaceservice.exceptions.UserNotFoundException;
import com.fyp.studentinterfaceservice.exceptions.UsernameExistsException;
import com.fyp.studentinterfaceservice.model.Position;
import com.fyp.studentinterfaceservice.model.User;
import com.fyp.studentinterfaceservice.model.UserPrincipal;
import com.fyp.studentinterfaceservice.jwt.JWTTokenProvider;
import com.fyp.studentinterfaceservice.services.interfaces.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.fyp.studentinterfaceservice.constant.SecurityConstants.EXPIRATION_TIME;

@RestController
public class StudentController {

    private final UserService userService;
    private final JWTTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;


    @Autowired
    public StudentController(UserService userService, JWTTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
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
        authenticate(loggedUser.getEmail(), loggedUser.getPassword());
        UserPrincipal userPrincipal = new UserPrincipal(loggedUser);

        loggedUser.setPassword(StringUtils.EMPTY);
        loggedUser.setExpiresIn(EXPIRATION_TIME);
        loggedUser.setToken(jwtTokenProvider.generateJwtToken(userPrincipal));

        return new ResponseEntity<>(loggedUser, HttpStatus.OK);
    }

    private void authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }

    @GetMapping("/verification/{token}")
    public ResponseEntity<String> verifyAccount(@PathVariable String token) {
        return userService.verifyAccount(token);
    }

    @GetMapping("/searchJobsApi/{keywords}")
    public List<Position> searchJobApi(@PathVariable String keywords) {
        return userService.searchJobsApi(keywords);
    }

}
