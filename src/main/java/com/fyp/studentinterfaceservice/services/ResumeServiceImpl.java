package com.fyp.studentinterfaceservice.services;

import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.model.Resume;
import com.fyp.studentinterfaceservice.model.Skill;
import com.fyp.studentinterfaceservice.model.User;
import com.fyp.studentinterfaceservice.services.interfaces.ResumeService;
import com.fyp.studentinterfaceservice.utilities.PDFGenerator;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.Deflater;

import static com.fyp.studentinterfaceservice.client.ProgradClient.bearerToken;

@Service
public class ResumeServiceImpl implements ResumeService {

    private final UserServiceImplementation userService;
    private final ProgradClient client;

    public ResumeServiceImpl(UserServiceImplementation userService, ProgradClient client) {
        this.userService = userService;
        this.client = client;
    }

    @Override
    public ResponseEntity<InputStreamResource> generateDCv(User user) {

            User userDb = userService.findUserByEmail(user.getEmail());
            ArrayList<String> skills = new ArrayList<>();

            if(userDb.getProfile().getProjects().size() == 0) {
                userDb.getProfile().getProjects().add(user.getProfile().getProjects().get(0));
                userService.updateUser(userDb);
            }

            if(!user.getProfile().getExternalSkills().isEmpty()) {
                for(Skill skill : user.getProfile().getExternalSkills()) {
                    skills.add(skill.getSkillName());
                }
            }

            byte[] data = PDFGenerator.generateDynamicCv(skills, user);

            ByteArrayInputStream bis = new ByteArrayInputStream(data);
            Resume resume = new Resume(user.getUsername() + "_CV" , userService.compressBytes(data), user.getStudentId());
            client.saveResume(bearerToken, resume);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "inline; filename=" + user.getUsername() +"_CV.pdf");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(bis));
    }

}
