package com.fyp.studentinterfaceservice.services.interfaces;

import com.fyp.studentinterfaceservice.exceptions.EmailExistsException;
import com.fyp.studentinterfaceservice.exceptions.ProgradException;
import com.fyp.studentinterfaceservice.exceptions.UnauthenticatedUserException;
import com.fyp.studentinterfaceservice.exceptions.UserNotFoundException;
import com.fyp.studentinterfaceservice.exceptions.UsernameExistsException;
import com.fyp.studentinterfaceservice.model.Position;
import com.fyp.studentinterfaceservice.model.User;
import com.fyp.studentinterfaceservice.model.UserProfile;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {

    User register(User user) throws UsernameExistsException, EmailExistsException, UserNotFoundException, ProgradException;

    User findUserByEmail(String email);

    User findUserByUsername(String username);

    User findUserByToken(String token);

    User getCurrentUser() throws UnauthenticatedUserException;

    ResponseEntity<String> verifyAccount(String token);

    List<User> getAllStudents();

    User updateUser(User user);

    List<String> getSkillsNames(UserProfile profile);

    UserProfile updateProfile(UserProfile profile);

    UserProfile addSkills(UserProfile profile);
}
