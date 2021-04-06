package com.fyp.studentinterfaceservice.services;

import com.careerjet.webservice.api.Client;
import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.exceptions.ProgradException;
import com.fyp.studentinterfaceservice.exceptions.UserNotFoundException;
import com.fyp.studentinterfaceservice.model.*;
import com.fyp.studentinterfaceservice.services.interfaces.PositionService;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.DataFormatException;
import java.util.zip.Inflater;

import static com.fyp.studentinterfaceservice.constant.Constants.*;

@Service
public class PositionServiceImpl implements PositionService {

    private final ProgradClient client;
    private final MailService mailService;
    private final UserServiceImpl userService;
    @Value("${careerjet.api.key}")
    private String apiKey;
    @Value("${frontend.port}")
    private String frontendPort;
    @Value("${token.secret}")
    private String secretToken;

    public PositionServiceImpl(ProgradClient client, MailService mailService, UserServiceImpl userService) {
        this.client = client;
        this.mailService = mailService;
        this.userService = userService;
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
    public ApplicationWrapper applicationsStats(String email) {
        ApplicationWrapper applicationsData = new ApplicationWrapper();
        List<ApplicationPosition> applicationPosition = new ArrayList<>();
        Map<String, Integer> statusMap = new HashMap<>();
        List<Application> applications = client.getApplicationsByEmail(secretToken, email);
        if(!applications.isEmpty()) {
            List<String> responses = new ArrayList<>();
            applications.forEach(application -> {
                if(application.getResume() != null && application.getResume().getData() != null) {
                    application.setResume(new Resume(decompressBytes(application.getResume().getData())));
                }
                Position position = client.findPositionById(secretToken, application.getPositionId());
                position.setCompany(new Company(position.getCompany().getName()));
                applicationPosition.add(
                        new ApplicationPosition(application,
                                position));
                responses.add(application.getStatus());
            });

            statusMap.put(NO_RESPONSE, Collections.frequency(responses, NO_RESPONSE));
            statusMap.put(REJECTED, Collections.frequency(responses, REJECTED));
            statusMap.put(ASKED_FOR_INTERVIEW, Collections.frequency(responses, ASKED_FOR_INTERVIEW));
            statusMap.put(OFFERED, Collections.frequency(responses, OFFERED));
            statusMap.put(UNDER_REVIEW, Collections.frequency(responses, UNDER_REVIEW));
            applicationsData.setStatusData(statusMap);
            applicationsData.setApplications(applicationPosition);
        }
        return applicationsData;
    }

    @Override
    public Application updateApplication(Application application) {
        if(application.getResume() != null && application.getResume().getData() != null)
            application.getResume().setData(userService.compressBytes(application.getResume().getData()));
        return client.updateApplication(secretToken, application);
    }

    public static byte[] decompressBytes(byte[] data) {
        Inflater inflater = new Inflater();
        inflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] buffer = new byte[1024];
        try {
            while (!inflater.finished()) {
                int count = inflater.inflate(buffer);
                outputStream.write(buffer, 0, count);
            }
            outputStream.close();
        } catch (IOException | DataFormatException ioe) {
            ioe.printStackTrace();
        }
        return outputStream.toByteArray();
    }
}
