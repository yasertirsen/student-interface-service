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

    @PostMapping("/generateDynamicCv/{companyName}/{jobTitle}")
    public Resume generateDynamicCv(@RequestBody User user, @PathVariable String companyName, @PathVariable String jobTitle) {
        return resumeService.generateDCv(user, companyName, jobTitle);
    }

    @GetMapping("getCv/{username}")
    public ResponseEntity<InputStreamResource> getCv(@PathVariable String username) {
        return resumeService.getCv(username);
    }

    @PostMapping(value = "upload/cv/{userId}")
    public Resume uploadCv(@RequestParam("cvFile") MultipartFile file, @PathVariable Long userId) throws IOException {
        return resumeService.uploadCv(file, userId);
    }

    @GetMapping("getAllCvs/{userId}")
    public List<Resume> getAllCvs(@PathVariable Long userId) {
        return resumeService.getAllCvs(userId);
    }

    @PutMapping("/updateCv")
    public Resume updateCv(@RequestBody Resume resume) {
        return resumeService.updateCv(resume);
    }
}
