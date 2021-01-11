package com.fyp.studentinterfaceservice.services;

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
import java.util.ArrayList;

@Service
public class ResumeServiceImpl implements ResumeService {

    private final UserServiceImplementation userService;

    public ResumeServiceImpl(UserServiceImplementation userService) {
        this.userService = userService;
    }

    @Override
    public ResponseEntity<InputStreamResource> generateDCv(User user) {

            User userDb = userService.findUserByEmail(user.getEmail());
            ArrayList<String> skills = new ArrayList<>();
            ArrayList<String> requirements = new ArrayList<>();
            if(!userDb.getProfile().getExternalSkills().isEmpty()) {
                for(Skill skill : userDb.getProfile().getExternalSkills()) {
                    skills.add(skill.getSkillName());
                }
            }
            if(!user.getProfile().getExternalSkills().isEmpty()) {
                for(Skill skill : user.getProfile().getExternalSkills()) {
                    requirements.add(skill.getSkillName());
                }
            }

            ByteArrayInputStream bis = PDFGenerator.generateDynamicCv(skills, requirements, user);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "inline; filename=" + user.getUsername() +"_CV.pdf");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(bis));
    }
}
