package com.fyp.studentinterfaceservice.controller;

import com.fyp.studentinterfaceservice.dto.CompanyWrapper;
import com.fyp.studentinterfaceservice.model.Company;
import com.fyp.studentinterfaceservice.model.CompanyProfile;
import com.fyp.studentinterfaceservice.model.MailingList;
import com.fyp.studentinterfaceservice.model.Review;
import com.fyp.studentinterfaceservice.services.interfaces.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    private final CompanyService companyService;

    @Autowired
    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping("/{name}")
    public CompanyWrapper getCompany(@PathVariable String name) {
        return companyService.getCompany(name);
    }

    @GetMapping("/all")
    public List<Company> getAllCompanies() {
        return companyService.getAllCompanies();
    }

    @PostMapping("/review")
    public Review review(@RequestBody Review review) {
        return companyService.review(review);
    }

    @GetMapping("/rating/{name}")
    public double getRating(@PathVariable String name) {
        return companyService.getRating(name);
    }

    @PutMapping("/updateProfile")
    public CompanyProfile updateProfile(@RequestBody CompanyProfile profile) {
        return companyService.updateProfile(profile);
    }

    @PostMapping("/addToMailing/{companyId}")
    public MailingList getMailingList(@PathVariable Long companyId, @RequestParam String email) {
        return companyService.addToMailingList(companyId, email);
    }
}
