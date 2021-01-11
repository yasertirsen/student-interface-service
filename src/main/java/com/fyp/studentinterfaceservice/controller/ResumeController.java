package com.fyp.studentinterfaceservice.controller;

import com.fyp.studentinterfaceservice.model.User;
import com.fyp.studentinterfaceservice.services.ResumeServiceImpl;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ResumeController {

    private final ResumeServiceImpl resumeService;

    public ResumeController(ResumeServiceImpl resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/generateDynamicCv")
    public ResponseEntity<InputStreamResource> generateDynamicCv(@RequestBody User user) {
        return resumeService.generateDCv(user);
    }
}
