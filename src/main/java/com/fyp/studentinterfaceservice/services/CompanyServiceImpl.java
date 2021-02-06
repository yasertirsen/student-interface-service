package com.fyp.studentinterfaceservice.services;

import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.model.Company;
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
    private String bearerToken;


    @Autowired
    public CompanyServiceImpl(ProgradClient client) {
        this.client = client;
    }

    @Override
    public Company getCompany(String name) {
        return client.findCompanyByName(bearerToken, name);
    }

    @Override
    public List<Company> getAllCompanies() {
        return client.getAllCompanies(bearerToken);
    }

    @Override
    public Review review(Review review) {
        return client.review(bearerToken, review);
    }

    @Override
    public double getRating(String name) {
        List<Review> reviews = client.findCompanyByName(bearerToken, name).getProfile().getReviews();
        if(reviews != null && reviews.size() != 0) {
            double positive = 0;
            for(Review review : reviews) {
                if(review.getReviewType().equalsIgnoreCase("P")) {
                    positive++;
                }
            }
            return ((positive / reviews.size()) * 5);
        }
        return 0.0;
    }
}
