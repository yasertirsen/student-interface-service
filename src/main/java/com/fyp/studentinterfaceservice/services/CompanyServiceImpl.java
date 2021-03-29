package com.fyp.studentinterfaceservice.services;

import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.dto.CompanyWrapper;
import com.fyp.studentinterfaceservice.model.Company;
import com.fyp.studentinterfaceservice.model.CompanyProfile;
import com.fyp.studentinterfaceservice.model.MailingList;
import com.fyp.studentinterfaceservice.model.Review;
import com.fyp.studentinterfaceservice.services.interfaces.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyServiceImpl implements CompanyService {

    private final ProgradClient client;
    @Value("${token.secret}")
    private String secretToken;


    @Autowired
    public CompanyServiceImpl(ProgradClient client) {
        this.client = client;
    }

    @Override
    public CompanyWrapper getCompany(String name) {
        return client.findCompanyByName(secretToken, name);
    }

    @Override
    public List<Company> getAllCompanies() {
        return client.getAllCompanies(secretToken);
    }

    @Override
    public Review review(Review review) {
        return client.review(secretToken, review);
    }

    @Override
    public double getRating(String name) {
        List<Review> reviews = client.findCompanyByName(secretToken, name).getCompany().getProfile().getReviews();
        if(reviews != null && reviews.size() != 0) {
            double positive = 0;
            for(Review review : reviews) {
                if(review.getType().equalsIgnoreCase("P")) {
                    positive++;
                }
            }
            return ((positive / reviews.size()) * 5);
        }
        return 0.0;
    }

    @Override
    public CompanyProfile updateProfile(CompanyProfile profile) {
        return client.updateCompanyProfile(secretToken, profile);
    }

    @Override
    public MailingList addToMailingList(Long companyId, String email) {
        return client.addToMailingList(secretToken, companyId, email);
    }
}
