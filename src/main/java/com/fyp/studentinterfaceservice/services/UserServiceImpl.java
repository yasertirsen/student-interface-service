package com.fyp.studentinterfaceservice.services;

import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.exceptions.*;
import com.fyp.studentinterfaceservice.model.*;
import com.fyp.studentinterfaceservice.services.interfaces.UserService;
import com.google.gson.Gson;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.zip.Deflater;

import static com.fyp.studentinterfaceservice.constant.ErrorConstants.EMAIL_ALREADY_EXISTS;
import static com.fyp.studentinterfaceservice.constant.ErrorConstants.USERNAME_ALREADY_EXISTS;
import static com.fyp.studentinterfaceservice.model.Role.ROLE_USER;


@Service
@Qualifier("UserDetailsService")
public class UserServiceImpl implements UserService, UserDetailsService {

    private final BCryptPasswordEncoder passwordEncoder;
    private final ProgradClient progradClient;
    private final MailService mailService;
    @Value("${token.secret}")
    private String secretToken;

    @Autowired
    public UserServiceImpl(BCryptPasswordEncoder passwordEncoder, ProgradClient progradClient, MailService mailService) {
        this.passwordEncoder = passwordEncoder;
        this.progradClient = progradClient;
        this.mailService = mailService;
    }

    @Override
    public User register(User user) throws UsernameExistsException, EmailExistsException, ProgradException, UserNotFoundException {
        validateUsernameAndEmail(user.getUsername(), user.getEmail());

        String verificationToken = UUID.randomUUID().toString();
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreated(Instant.now());
        user.setEnabled(false);
        user.setIsLocked(false);
        user.setRole(ROLE_USER.name());
        user.setAuthorities(ROLE_USER.getAuthorities());
        user.setToken(verificationToken);
        user.setProfile(new UserProfile());

        User registeredUser = progradClient.add(user);

        mailService.sendMail(new NotificationEmail("Account Activation - Prograd",
                user.getEmail(), "Thank you for signing up to Prograd, " +
                "please click the link below to activate your account " +
                "http://localhost:8083/verification/" + verificationToken));

        return registeredUser;
    }

    private void validateUsernameAndEmail(String newUsername, String newEmail) throws UsernameExistsException, EmailExistsException, UserNotFoundException {
        User userByEmail = findUserByEmail(newEmail);
        if(userByEmail != null) {
            throw new EmailExistsException(EMAIL_ALREADY_EXISTS);
        }
        User userByUsername = findUserByUsername(newUsername);
        if(userByUsername != null) {
            throw new UsernameExistsException(USERNAME_ALREADY_EXISTS);
        }
    }

    @Override
    public User findUserByEmail(String email) throws UserNotFoundException {
        return progradClient.findByEmail(secretToken, email).getBody();
    }

    @Override
    public User findUserByUsername(String username) {
        return progradClient.findByUsername(secretToken, username).getBody();
    }

    @Override
    public User findUserByToken(String token) throws UserNotFoundException {
        return progradClient.findByToken(secretToken, token).getBody();
    }

    @SneakyThrows
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findUserByEmail(username);
        return new UserPrincipal(user);
    }

    @Override
    public ResponseEntity<String> verifyAccount(String token) throws UserNotFoundException {
        User user = findUserByToken(token);
        user.setEnabled(true);
        progradClient.update(secretToken, user);

        return new ResponseEntity<>(new Gson().toJson("Account Activated Successfully"), HttpStatus.OK);
    }

    @Override
    public List<User> getAllStudents() {
        return progradClient.getAllStudents(secretToken);
    }

    @Override
    public User getCurrentUser() throws UnauthenticatedUserException, UserNotFoundException {
        String email = (String) SecurityContextHolder.
                getContext().getAuthentication().getPrincipal();
        return findUserByEmail(email);
    }

    @Override
    public User updateUser(@RequestBody User user) {
        return progradClient.update(secretToken, user);
    }

    @Override
    public List<String> getSkillsNames(UserProfile profile) {
        return progradClient.getSkillsNames(secretToken, profile);
    }

    @Override
    public ResponseEntity<String> uploadImage(MultipartFile file, Long userId) throws IOException {
        Image img = new Image(file.getOriginalFilename(), file.getContentType(),
                compressBytes(file.getBytes()), userId);
        return progradClient.uploadImage(secretToken, img);
    }

    @Override
    public Image getImage(Long userId) {
        return progradClient.getStudentAvatar(secretToken, userId);
    }

    @Override
    public Set<Skill> getAllSkills() {
        return progradClient.getAllSkills(secretToken);
    }

    @Override
    public User findUserById(Long studentId) {
        return progradClient.findById(secretToken, studentId);
    }

    @Override
    public User verifyChangePassword(String token, String password) throws UserNotFoundException {
        User user = findUserByToken(token);
        user.setPassword(passwordEncoder.encode(password));
        user.setEnabled(true);
        return updateUser(user);
    }

    @Override
    public ResponseEntity<String> sendVerifyEmail(String email) throws UserNotFoundException, ProgradException {
        User user = findUserByEmail(email);
        String token = UUID.randomUUID().toString();
        mailService.sendMail(new NotificationEmail("Change Password - Prograd",
                user.getEmail(), "We received a change password request, " +
                "please click the link below to change your password " +
                "http://localhost:4202/new-password/" + token));
        user.setToken(token);
        updateUser(user);
        return new ResponseEntity<>(new Gson().toJson("Verification email sent"), HttpStatus.OK);
    }

    @Override
    public List<User> getUniHiredStudents(String companyName, Long userId) {
        Company company = progradClient.findCompanyByName(secretToken, companyName).getCompany();
        User loggedUser = progradClient.findById(secretToken, userId);
        if(loggedUser.getProfile().getCourse() == null)
            return new ArrayList<>();
        else {
            List<User> hiredStudents = new ArrayList<>();
            User user;
            for (Long id : company.getProfile().getHiredStudents()) {
                user = progradClient.findById(secretToken, id);
                if (user.getProfile().getCourse().getUniversity()
                        .equalsIgnoreCase(loggedUser.getProfile().getCourse().getUniversity())) {
                    hiredStudents.add(user);
                }
            }
            return hiredStudents;
        }
    }

    public byte[] compressBytes(byte[] data) {
        Deflater deflater = new Deflater();
        deflater.setInput(data);
        deflater.finish();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] buffer = new byte[1024];
        while (!deflater.finished()) {
            int count = deflater.deflate(buffer);
            outputStream.write(buffer, 0, count);
        }
        try {
            outputStream.close();
        } catch (IOException ignored) {
        }

        return outputStream.toByteArray();
    }

    @Override
    public UserProfile updateProfile(UserProfile profile) {
        return progradClient.updateProfile(secretToken, profile);
    }

}
