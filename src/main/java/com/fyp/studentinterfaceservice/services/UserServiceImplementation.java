package com.fyp.studentinterfaceservice.services;

import com.careerjet.webservice.api.Client;
import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.exceptions.EmailExistsException;
import com.fyp.studentinterfaceservice.exceptions.ProgradException;
import com.fyp.studentinterfaceservice.exceptions.UsernameExistsException;
import com.fyp.studentinterfaceservice.model.Company;
import com.fyp.studentinterfaceservice.model.NotificationEmail;
import com.fyp.studentinterfaceservice.model.Position;
import com.fyp.studentinterfaceservice.model.Resume;
import com.fyp.studentinterfaceservice.model.User;
import com.fyp.studentinterfaceservice.model.UserPrincipal;
import com.fyp.studentinterfaceservice.model.UserProfile;
import com.fyp.studentinterfaceservice.services.interfaces.UserService;
import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
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

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
        user.setResume(new Resume());

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
        User user = findUserByToken(token);        user.setEnabled(true);
        progradClient.update(bearerToken, user);

        return new ResponseEntity<>(new Gson().toJson("Account Activated Successfully"), HttpStatus.OK);
    }

    @Override
    public List<User> getAllStudents() {
        return progradClient.getAllStudents(bearerToken);
    }

    @Override
    public User getCurrentUser() {
        User principal = (User) SecurityContextHolder.
                getContext().getAuthentication().getPrincipal();
        return findUserByUsername(principal.getUsername());
    }

    public List<Position> searchJobsApi() {
        Client careerjetClient = new Client("en_GB");
        List<Position> positions = new ArrayList<>();

        Map<String, String> args1 = new HashMap<String, String>();
        args1.put("keywords", "graduate technology");
        args1.put("location", "Dublin");

        args1.put("affid", "d5bae8e1fcebbd44fcda331aead3f612");

        args1.put("user_ip",    "127.0.0.1");
        args1.put("user_agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                + "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246");
        args1.put("url", "http://127.0.0.1/result");

        JSONObject results = (JSONObject) careerjetClient.search(args1);

        // A list of jobs is returned
        if (results.get("type").equals("JOBS")) {
            JSONArray jobs = (JSONArray) results.get("jobs");
            //System.out.println("Number of results:" + results.get("hits"));
            int index = 0;

            while( index < jobs.size()) {
                JSONObject job = (JSONObject) jobs.get(index);
                Position position = new Position();
                position.setTitle(job.get("title").toString());
                position.setDescription(job.get("description").toString());
                position.setCompany(job.get("company").toString());

                positions.add(position);

//                System.out.println("URL         :" + job.get("url"));
//                System.out.println("TITLE       :" + job.get("title"));
//                System.out.println("COMPANY     :" + job.get("company"));
//                System.out.println("SALARY      :" + job.get("salary"));
//                System.out.println("DATE        :" + job.get("date"));
//                System.out.println("DESCRIPTION :" + job.get("description"));
//                System.out.println("SITE        :" + job.get("site"));
//                System.out.println("LOCATIONS   :" + job.get("locations"));
                index++;
            }
        }

        // The location was amiguous. Suggestions are returned.
        // Add the location_id to the query to resolve the ambiguity.
        if (results.get("type").equals("LOCATIONS")) {
            System.out.println("Narrow down your location ");
            System.out.println("Please specify a location");
            JSONArray solvelocations = (JSONArray) results.get("solveLocations");
            int index = 0;
            while(index < solvelocations.size()) {
                JSONObject location = (JSONObject) solvelocations.get(index);
                System.out.println("NAME        :" + location.get("name"));
                System.out.println("LOCATION ID :" + location.get("location_id"));
                index++;
            }
        }

        // An error occured. An error message is returned.
        if (results.get("type").equals("ERROR")) {
            System.out.println("An error occurred whilst processing the search query");
            System.out.println("Error message    :" + results.get("ERROR"));
        }
        return positions;
    }

}
