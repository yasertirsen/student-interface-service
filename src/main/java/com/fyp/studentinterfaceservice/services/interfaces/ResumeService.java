package com.fyp.studentinterfaceservice.services.interfaces;

import com.fyp.studentinterfaceservice.model.User;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;

public interface ResumeService {

    ResponseEntity<InputStreamResource> generateDCv(User user);
}
