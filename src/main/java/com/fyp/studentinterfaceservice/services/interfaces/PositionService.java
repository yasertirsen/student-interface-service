package com.fyp.studentinterfaceservice.services.interfaces;

import com.fyp.studentinterfaceservice.exceptions.ProgradException;
import com.fyp.studentinterfaceservice.model.Application;
import com.fyp.studentinterfaceservice.model.Position;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PositionService {

    List<Position> getAllPositions();

    Position getPosition(Long id);

    List<Position> searchPositions(String location, String keywords);

    List<Position> searchJobsApi(String location, String keywords);

    List<Position> getCompanyPositions(Long companyId);

    ResponseEntity<String> apply(Application application) throws ProgradException;

    List<Application> getApplicationsByEmail(String email);
}
