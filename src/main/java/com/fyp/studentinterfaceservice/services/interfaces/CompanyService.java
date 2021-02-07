package com.fyp.studentinterfaceservice.services.interfaces;

import com.fyp.studentinterfaceservice.model.Company;
import com.fyp.studentinterfaceservice.model.CompanyProfile;
import com.fyp.studentinterfaceservice.model.Review;

import java.util.List;

public interface CompanyService {
    Company getCompany(String id);

    List<Company> getAllCompanies();

    Review review(Review review);

    double getRating(String name);

    CompanyProfile updateProfile(CompanyProfile profile);
}
