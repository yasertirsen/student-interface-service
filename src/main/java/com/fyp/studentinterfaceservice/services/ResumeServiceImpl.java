package com.fyp.studentinterfaceservice.services;

import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.model.Resume;
import com.fyp.studentinterfaceservice.model.User;
import com.fyp.studentinterfaceservice.services.interfaces.ResumeService;
import com.fyp.studentinterfaceservice.utilities.PDFGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ResumeServiceImpl implements ResumeService {

    private final UserServiceImpl userService;
    private final ProgradClient client;
    @Value("${token.secret}")
    private String secretToken;

    public ResumeServiceImpl(UserServiceImpl userService, ProgradClient client) {
        this.userService = userService;
        this.client = client;
    }

    @Override
    public Resume generateDCv(User user, String companyName, String jobTitle) {
            byte[] data = PDFGenerator.generateDynamicCv(user);
            Resume resume = new Resume(companyName + "_" + jobTitle + "_CV",
                    userService.compressBytes(data), user.getStudentId());
            return client.saveResume(secretToken, resume);
    }

    @Override
    public ResponseEntity<InputStreamResource> getCv(String username) {
        User user = userService.findUserByUsername(username);
        user.getProfile().getCourse().setModules(null);

        byte[] data = PDFGenerator.generateDynamicCv(user);
        ByteArrayInputStream bis = new ByteArrayInputStream(data);
        Resume resume = new Resume(user.getUsername() + "_CV" , userService.compressBytes(data), user.getStudentId());
        client.saveResume(secretToken, resume);
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }

    @Override
    public Resume uploadCv(MultipartFile file, Long userId) throws IOException {
        Resume resume = new Resume(file.getOriginalFilename(), userService.compressBytes(file.getBytes()),
                userId);
        return client.saveResume(secretToken, resume);
    }

    @Override
    public List<Resume> getAllCvs(Long userId) {
        return client.getAllCvs(secretToken, userId);
    }

    @Override
    public Resume updateCv(Resume resume) {
        resume.setData(userService.compressBytes(resume.getData()));
        return client.updateCv(secretToken, resume);
    }

}
