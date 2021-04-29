package com.fyp.studentinterfaceservice.services.interfaces;

import com.fyp.studentinterfaceservice.dto.CompanyWrapper;
import com.fyp.studentinterfaceservice.model.Company;
import com.fyp.studentinterfaceservice.model.CompanyProfile;
import com.fyp.studentinterfaceservice.model.MailingList;
import com.fyp.studentinterfaceservice.model.Review;

import java.util.List;

public interface CompanyService {
    CompanyWrapper getCompany(String name);


    List<Company> getAllCompanies();

    Review review(Review review);

    double getRating(String name);

    CompanyProfile updateProfile(CompanyProfile profile);

    MailingList addToMailingList(Long companyId, String email);

    MailingList getMailingList(Long companyId);
}
