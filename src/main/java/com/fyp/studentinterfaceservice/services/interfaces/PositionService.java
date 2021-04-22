package com.fyp.studentinterfaceservice.services.interfaces;

import com.fyp.studentinterfaceservice.exceptions.ProgradException;
import com.fyp.studentinterfaceservice.exceptions.UserNotFoundException;
import com.fyp.studentinterfaceservice.model.Application;
import com.fyp.studentinterfaceservice.model.ApplicationWrapper;
import com.fyp.studentinterfaceservice.model.Position;
import org.springframework.http.ResponseEntity;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

public interface PositionService {

    List<Position> getAllPositions();

    Position getPosition(Long id);

    List<Position> searchPositions(String location, String keywords);

    List<Position> searchJobsApi(String location, String keywords);

    List<Position> getCompanyPositions(Long companyId);

    ResponseEntity<String> apply(Application application) throws ProgradException;

    List<Application> getApplicationsByEmail(String email);

    Position update(Position position);

    List<Position> getJobRecommendations(String email) throws UserNotFoundException;

    ApplicationWrapper applicationsStats(String email);

    Application updateApplication(Application application);

    Map<String, Double> searchSalaries(String keywords, String location) throws ParseException;
}
