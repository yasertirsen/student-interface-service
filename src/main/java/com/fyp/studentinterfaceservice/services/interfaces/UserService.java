package com.fyp.studentinterfaceservice.services.interfaces;

import com.fyp.studentinterfaceservice.exceptions.EmailExistsException;
import com.fyp.studentinterfaceservice.exceptions.UserNotFoundException;
import com.fyp.studentinterfaceservice.exceptions.UsernameExistsException;
import com.fyp.studentinterfaceservice.models.User;

public interface UserService {

    User register(User user) throws UsernameExistsException, EmailExistsException, UserNotFoundException;

    User findUserByEmail(String email);

    User findUserByUsername(String username);

    User login(User user) throws Exception;
}
