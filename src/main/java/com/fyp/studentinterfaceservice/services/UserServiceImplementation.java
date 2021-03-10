package com.fyp.studentinterfaceservice.services;

import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.exceptions.EmailExistsException;
import com.fyp.studentinterfaceservice.exceptions.ProgradException;
import com.fyp.studentinterfaceservice.exceptions.UnauthenticatedUserException;
import com.fyp.studentinterfaceservice.exceptions.UsernameExistsException;
import com.fyp.studentinterfaceservice.model.*;
import com.fyp.studentinterfaceservice.services.interfaces.UserService;
import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;
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
import java.util.*;
import java.util.zip.Deflater;

import static com.fyp.studentinterfaceservice.constant.ErrorConstants.EMAIL_ALREADY_EXISTS;
import static com.fyp.studentinterfaceservice.constant.ErrorConstants.USERNAME_ALREADY_EXISTS;
import static com.fyp.studentinterfaceservice.model.Role.ROLE_USER;


@Service
@Qualifier("UserDetailsService")
public class UserServiceImplementation implements UserService, UserDetailsService {

    private final BCryptPasswordEncoder passwordEncoder;
    private final ProgradClient progradClient;
    private final MailService mailService;

  @Value("${token.secret}")
  private String bearerToken;

    @Autowired
    public UserServiceImplementation(BCryptPasswordEncoder passwordEncoder, ProgradClient progradClient, MailService mailService) {
        this.passwordEncoder = passwordEncoder;
        this.progradClient = progradClient;
        this.mailService = mailService;
    }

    @Override
    public User register(User user) throws UsernameExistsException, EmailExistsException, ProgradException {
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
        registeredUser.setPassword(StringUtils.EMPTY);

        mailService.sendMail(new NotificationEmail("Account Activation - Prograd",
                user.getEmail(), "Thank you for signing up to Prograd, " +
                "please click the link below to activate your account " +
                "http://localhost:8083/verification/" + verificationToken));

        return registeredUser;
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
    public User findUserByToken(String token) {
        return progradClient.findByToken(bearerToken, token).getBody();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findUserByEmail(username);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return new UserPrincipal(user);
    }

    @Override
    public ResponseEntity<String> verifyAccount(String token) {
        User user = findUserByToken(token);
        user.setEnabled(true);
        progradClient.update(bearerToken, user);

        return new ResponseEntity<>(new Gson().toJson("Account Activated Successfully"), HttpStatus.OK);
    }

    @Override
    public List<User> getAllStudents() {
        return progradClient.getAllStudents(bearerToken);
    }

    @Override
    public User getCurrentUser() throws UnauthenticatedUserException {
        String email = (String) SecurityContextHolder.
                getContext().getAuthentication().getPrincipal();
        return findUserByEmail(email);
    }

    @Override
    public User updateUser(@RequestBody User user) {
        return progradClient.update(bearerToken, user);
    }

    @Override
    public List<String> getSkillsNames(UserProfile profile) {
        return progradClient.getSkillsNames(bearerToken, profile);
    }

    @Override
    public UserProfile addSkills(UserProfile profile) {
        Set<Skill> skillSet = new HashSet<>();
        for(Module module : profile.getCourse().getModules()) {
            if(module.getSkill() != null) {
                Skill skill = module.getSkill();
                if(!profile.getExternalSkills().contains(skill)) {
                    skillSet.add(skill);
                }
            }
        }
        profile.setExternalSkills(skillSet);
        return progradClient.updateProfile(bearerToken, profile);
    }

    @Override
    public ResponseEntity<String> uploadImage(MultipartFile file, Long userId) throws IOException {
        Image img = new Image(file.getOriginalFilename(), file.getContentType(),
                compressBytes(file.getBytes()), userId);
        return progradClient.uploadImage(bearerToken, img);
    }

    @Override
    public Image getImage(Long userId) {
        return progradClient.getStudentAvatar(bearerToken, userId);
    }

    @Override
    public Set<Skill> getAllSkills() {
        return progradClient.getAllSkills(bearerToken);
    }

    @Override
    public User findUserById(Long studentId) {
        return progradClient.findById(bearerToken, studentId);
    }

    @Override
    public User changePassword(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return progradClient.add(user);
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
        return progradClient.updateProfile(bearerToken, profile);
    }

}
