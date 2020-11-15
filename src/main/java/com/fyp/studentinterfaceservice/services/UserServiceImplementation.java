package com.fyp.studentinterfaceservice.services;

import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.exceptions.EmailExistsException;
import com.fyp.studentinterfaceservice.exceptions.UsernameExistsException;
import com.fyp.studentinterfaceservice.models.User;
import com.fyp.studentinterfaceservice.models.UserPrincipal;
import com.fyp.studentinterfaceservice.services.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

import static com.fyp.studentinterfaceservice.constant.ErrorConstants.EMAIL_ALREADY_EXISTS;
import static com.fyp.studentinterfaceservice.constant.ErrorConstants.USERNAME_ALREADY_EXISTS;
import static com.fyp.studentinterfaceservice.models.Role.ROLE_USER;


@Service
@Qualifier("UserDetailsService")
public class UserServiceImplementation implements UserService, UserDetailsService {

    private final BCryptPasswordEncoder passwordEncoder;
  private final ProgradClient progradClient;

  @Value("${token.secret}")
  private String bearerToken;

    @Autowired
    public UserServiceImplementation(BCryptPasswordEncoder passwordEncoder, ProgradClient progradClient) {
        this.passwordEncoder = passwordEncoder;
        this.progradClient = progradClient;
    }

    @Override
    public User register(User user) throws UsernameExistsException, EmailExistsException {
        validateUsernameAndEmail(user.getUsername(), user.getEmail());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreated(Instant.now());
        user.setEnabled(true);
        user.setIsLocked(false);
        user.setRole(ROLE_USER.name());
        user.setAuthorities(ROLE_USER.getAuthorities());
        return progradClient.register(user);
    }

    private void validateUsernameAndEmail(String newUsername, String newEmail) throws UsernameExistsException, EmailExistsException {
        User userByEmail = findUserByEmail(newEmail);
        if(userByEmail != null) {
            throw new EmailExistsException(EMAIL_ALREADY_EXISTS);
        }
        User userByUsername = findUserByUsername(newUsername);
        if(userByUsername != null) {
            throw new UsernameExistsException(USERNAME_ALREADY_EXISTS);
        }
//        if(StringUtils.isNotBlank(currentEmail)) {
//            User currentUser = findUserByEmail(newEmail);
//            if(currentUser == null) {
//                throw new UserNotFoundException("No user found by email " + currentEmail);
//            }
//            User userByEmail = findUserByEmail(newEmail);
//            if(userByEmail != null && !currentUser.getStudentId().equals(userByEmail.getExpiresIn())) {
//                throw new EmailExistsException("Email already exists");
//            }
//            User userByUsername = findUserByEmail(newUsername);
//            if(userByUsername != null && !currentUser.getStudentId().equals(userByEmail.getExpiresIn())) {
//                throw new UsernameExistsException("Username already exists");
//            }
//            return currentUser;
//        } else {
//            User userByEmail = findUserByEmail(newEmail);
//            if(userByEmail != null) {
//                throw new EmailExistsException("Email already exists");
//            }
//            User userByUsername = findUserByEmail(newEmail);
//            if(userByUsername != null) {
//                throw new UsernameExistsException("Username already exists");
//            }
//            return null;
//        }
    }

    @Override
    public User findUserByEmail(String email) {
        return progradClient.findByEmail(bearerToken, email).getBody();
    }

    @Override
    public User findUserByUsername(String username) {
        return progradClient.findByUsername(bearerToken, username).getBody();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findUserByEmail(username);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return new UserPrincipal(user);
    }

    @Override
    public User login(User user) {
        return progradClient.login(bearerToken, user);
    }
}
