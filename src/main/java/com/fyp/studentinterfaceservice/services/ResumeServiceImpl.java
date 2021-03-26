package com.fyp.studentinterfaceservice.services;

import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.model.*;
import com.fyp.studentinterfaceservice.services.interfaces.ResumeService;
import com.fyp.studentinterfaceservice.utilities.PDFGenerator;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import static com.fyp.studentinterfaceservice.client.ProgradClient.bearerToken;

@Service
public class ResumeServiceImpl implements ResumeService {

    private final UserServiceImpl userService;
    private final ProgradClient client;

    public ResumeServiceImpl(UserServiceImpl userService, ProgradClient client) {
        this.userService = userService;
        this.client = client;
    }

    @Override
    public Resume generateDCv(User user) {
            byte[] data = PDFGenerator.generateDynamicCv(user);

            ByteArrayInputStream bis = new ByteArrayInputStream(data);
            Resume resume = new Resume(user.getUsername() + "_CV" , userService.compressBytes(data), user.getStudentId());
            client.saveResume(bearerToken, resume);

            return client.saveResume(bearerToken, resume);
    }

    @Override
    public ResponseEntity<InputStreamResource> getCv(String username) {
        User user = userService.findUserByUsername(username);
        user.getProfile().getCourse().setModules(null);

        byte[] data = PDFGenerator.generateDynamicCv(user);
        ByteArrayInputStream bis = new ByteArrayInputStream(data);
        Resume resume = new Resume(user.getUsername() + "_CV" , userService.compressBytes(data), user.getStudentId());
        client.saveResume(bearerToken, resume);
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }

    @Override
    public Resume uploadCv(MultipartFile file, Long userId) throws IOException {
        Resume resume = new Resume(file.getOriginalFilename(), userService.compressBytes(file.getBytes()),
                userId);
        return client.saveResume(bearerToken, resume);
    }

}
