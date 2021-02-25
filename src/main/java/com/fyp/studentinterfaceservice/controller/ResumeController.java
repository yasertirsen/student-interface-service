package com.fyp.studentinterfaceservice.controller;

import com.fyp.studentinterfaceservice.model.Resume;
import com.fyp.studentinterfaceservice.model.User;
import com.fyp.studentinterfaceservice.services.ResumeServiceImpl;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
public class ResumeController {

    private final ResumeServiceImpl resumeService;

    public ResumeController(ResumeServiceImpl resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/generateDynamicCv")
    public Resume generateDynamicCv(@RequestBody User user) {
        return resumeService.generateDCv(user);
    }

    @GetMapping("getCv/{username}")
    public ResponseEntity<InputStreamResource> getCv(@PathVariable String username) {
        return resumeService.getCv(username);
    }

    @PostMapping(value = "upload/cv/{userId}")
    public Resume uploadCv(@RequestParam("cvFile") MultipartFile file, @PathVariable Long userId) throws IOException {
        return resumeService.uploadCv(file, userId);
    }
}
