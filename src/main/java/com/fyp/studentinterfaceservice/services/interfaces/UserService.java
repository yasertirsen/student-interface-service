package com.fyp.studentinterfaceservice.services.interfaces;

import com.fyp.studentinterfaceservice.exceptions.EmailExistsException;
import com.fyp.studentinterfaceservice.exceptions.ProgradException;
import com.fyp.studentinterfaceservice.exceptions.UserNotFoundException;
import com.fyp.studentinterfaceservice.exceptions.UsernameExistsException;
import com.fyp.studentinterfaceservice.model.Position;
import com.fyp.studentinterfaceservice.model.User;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {

    User register(User user) throws UsernameExistsException, EmailExistsException, UserNotFoundException, ProgradException;

    User findUserByEmail(String email);

    User findUserByUsername(String username);

    User findUserByToken(String token);

    User getCurrentUser();

    ResponseEntity<String> verifyAccount(String token);

    List<User> getAllStudents();

    List<Position> searchJobsApi();
}