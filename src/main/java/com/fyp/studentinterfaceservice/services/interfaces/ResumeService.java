package com.fyp.studentinterfaceservice.services.interfaces;

import com.fyp.studentinterfaceservice.model.Resume;
import com.fyp.studentinterfaceservice.model.User;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ResumeService {

    Resume generateDCv(User user);

    ResponseEntity<InputStreamResource> getCv(String username);

    Resume uploadCv(MultipartFile file, Long userId) throws IOException;
}
