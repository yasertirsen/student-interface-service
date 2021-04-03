package com.fyp.studentinterfaceservice.services;

import com.careerjet.webservice.api.Client;
import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.exceptions.ProgradException;
import com.fyp.studentinterfaceservice.exceptions.UserNotFoundException;
import com.fyp.studentinterfaceservice.model.Application;
import com.fyp.studentinterfaceservice.model.Company;
import com.fyp.studentinterfaceservice.model.NotificationEmail;
import com.fyp.studentinterfaceservice.model.Position;
import com.fyp.studentinterfaceservice.services.interfaces.PositionService;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.fyp.studentinterfaceservice.constant.Constants.*;

@Service
public class PositionServiceImpl implements PositionService {

    private final ProgradClient client;
    private final MailService mailService;
    @Value("${careerjet.api.key}")
    private String apiKey;
    @Value("${frontend.port}")
    private String frontendPort;
    @Value("${token.secret}")
    private String secretToken;

    public PositionServiceImpl(ProgradClient client, MailService mailService) {
        this.client = client;
        this.mailService = mailService;
    }

    @Override
    public List<Position> getAllPositions() {
        return client.getAllPositions(secretToken);
    }

    @Override
    public Position getPosition(Long id) {
        return client.findPositionById(secretToken, id);
    }

    @Override
    public List<Position> searchPositions(String location, String keywords) {
        List<Position> positions = client.getAllPositions(secretToken);
        List<String> keywordsList = new ArrayList<>(Arrays.asList(keywords.toLowerCase().split(" ")));
        String pattern = String.join("|", keywordsList);
        List<Position> matchedPositions = new ArrayList<>();
        for(Position position : positions) {
            Matcher matcher = Pattern.compile(pattern).matcher(position.getTitle().toLowerCase());
            if(matcher.find()) {
                if(location.equalsIgnoreCase("undefined"))
                    matchedPositions.add(position);
                else {
                    if(position.getLocation().equalsIgnoreCase(location))
                        matchedPositions.add(position);
                }
            }
        }
        return matchedPositions;
    }

    public List<Position> searchJobsApi(String location, String keywords) {
        if(location.equalsIgnoreCase("undefined")) {
            location = "";
        }
        Client careerjetClient = new Client("en_GB");
        List<Position> positions = new ArrayList<>();

        Map<String, String> args1 = new HashMap<>();
        args1.put("keywords", keywords);
        args1.put("location", location);

        args1.put("affid", apiKey);

        args1.put("user_ip",    "Placeholder");
        args1.put("user_agent", "Placeholder");
        args1.put("url", "http://127.0.0.1/result");

        JSONObject results = (JSONObject) careerjetClient.search(args1);

        // A list of jobs is returned
        if (results.get("type").equals("JOBS")) {
            JSONArray jobs = (JSONArray) results.get("jobs");
            int index = 0;

            while( index < jobs.size()) {
                JSONObject job = (JSONObject) jobs.get(index);
                Position position = new Position();
                position.setTitle(job.get("title").toString());
                position.setDescription(job.get("description").toString());
                position.setLocation(job.get("locations").toString());
                position.setDate(job.get("date").toString());
                position.setUrl(job.get("url").toString());
                Company company = new Company();
                company.setName(job.get("company").toString());
                position.setCompany(company);
                positions.add(position);
                index++;
            }
        }
        if (results.get("type").equals("ERROR")) {
            System.out.println("An error occurred whilst processing the search query");
            System.out.println("Error message    :" + results.get("ERROR"));
        }
        return positions;
    }

    @Override
    public List<Position> getCompanyPositions(Long companyId) {
        return client.getCompanyPositions(secretToken, companyId);
    }

    @Override
    public ResponseEntity<String> apply(Application application) throws ProgradException {
        Position position = client.findPositionById(secretToken, application.getPositionId());
        mailService.sendMail(new NotificationEmail("New Response - " + position.getTitle(),
                position.getCompany().getEmail(),  "Hi, \n" +
                "A new application has been submitted to your job post on Prograd. Please check the applications below.\n" +
                frontendPort + "applications/" + position.getPositionId()));
        mailService.sendMail(new NotificationEmail("Application Successful - " + position.getTitle(),
                application.getEmail(),
                "Hi, \n" +
                "Your application for " + position.getTitle() + " has been submitted successfully.\n"));
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        application.setDate(dtf.format(LocalDateTime.now()));
        application.setStatus(NO_RESPONSE);
        return client.apply(secretToken, application);
    }

    @Override
    public List<Application> getApplicationsByEmail(String email) {
        return client.getApplicationsByEmail(secretToken, email);
    }

    @Override
    public Position update(Position position) {
        return client.updatePosition(secretToken, position);
    }

    @Override
    public List<Position> getJobRecommendations(String email) throws UserNotFoundException {
        List<String> skills = new ArrayList<>();
        Objects.requireNonNull(client.findByEmail(secretToken, email).getBody()).getProfile().getExternalSkills()
                .forEach(skill -> {
                    skills.add(skill.getSkillName());
                });
        List<Position> positions = new ArrayList<>();
        if(skills.size() > 0) {
            for(Position position : client.getAllPositions(secretToken)) {
                position.getRequirements().forEach(req -> {
                    if(skills.contains(req.getSkillName())) {
                        if(!positions.contains(position))
                            positions.add(position);
                    }
                });
                if(positions.size() > 10)
                    break;
            }
        }
        return positions;
    }

    @Override
    public Map<String, Integer> applicationsStats(String email) {
        Map<String, Integer> stats = new HashMap<>();
        List<Application> applications = client.getApplicationsByEmail(secretToken, email);
        if(!applications.isEmpty()) {
            List<String> responses = new ArrayList<>();
            applications.forEach(application -> {
                responses.add(application.getStatus());
            });

            stats.put(NO_RESPONSE, Collections.frequency(responses, NO_RESPONSE));
            stats.put(REJECTED, Collections.frequency(responses, REJECTED));
            stats.put(ASKED_FOR_INTERVIEW, Collections.frequency(responses, ASKED_FOR_INTERVIEW));
            stats.put(OFFERED, Collections.frequency(responses, OFFERED));
            stats.put(UNDER_REVIEW, Collections.frequency(responses, UNDER_REVIEW));
            return stats;
        }
        return new HashMap<>();
    }
}
