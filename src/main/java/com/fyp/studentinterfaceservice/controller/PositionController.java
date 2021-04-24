package com.fyp.studentinterfaceservice.controller;

import com.fyp.studentinterfaceservice.exceptions.ProgradException;
import com.fyp.studentinterfaceservice.exceptions.StudentExceptionHandler;
import com.fyp.studentinterfaceservice.exceptions.UserNotFoundException;
import com.fyp.studentinterfaceservice.model.Application;
import com.fyp.studentinterfaceservice.model.ApplicationWrapper;
import com.fyp.studentinterfaceservice.model.Position;
import com.fyp.studentinterfaceservice.services.interfaces.PositionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

@RestController
public class PositionController extends StudentExceptionHandler {

    private final PositionService positionService;

    public PositionController(PositionService positionService) {
        this.positionService = positionService;
    }

    @GetMapping("/getAllPositions")
    public List<Position> getAllPositions() {
        return positionService.getAllPositions();
    }

    @GetMapping("/getPosition/{positionId}")
    public Position getPosition(@PathVariable Long positionId) {
        return positionService.getPosition(positionId);
    }

    @GetMapping("/getCompanyPositions/{companyId}")
    public List<Position> getCompanyPositions(@PathVariable Long companyId) {
        return positionService.getCompanyPositions(companyId);
    }

    @GetMapping("/searchPositions/{location}/{keywords}")
    public List<Position> searchPositions(@PathVariable String location, @PathVariable String keywords) {
        return positionService.searchPositions(location, keywords);
    }

    @GetMapping("/searchJobsApi/{location}/{keywords}")
    public List<Position> searchJobApi(@PathVariable String location, @PathVariable String keywords, @RequestHeader(value = "User-Agent") String userAgent) {
        return positionService.searchJobsApi(location, keywords, userAgent);
    }

    @PostMapping("/apply")
    public ResponseEntity<String> apply(@RequestBody Application application) throws ProgradException {
        return positionService.apply(application);
    }

    @GetMapping("/getApplicationsByEmail")
    public List<Application> getApplicationsByEmail(@RequestParam String email) {
        return positionService.getApplicationsByEmail(email);
    }

    @PutMapping("/positions/update")
    public Position updatePosition(@RequestBody Position position) {
        return positionService.update(position);
    }

    @GetMapping("/positions/recommend")
    public List<Position> getJobRecommendations(@RequestParam String email) throws UserNotFoundException {
        return positionService.getJobRecommendations(email);
    }

    @GetMapping("/applicationsStats")
    public ApplicationWrapper getApplicationsStats(@RequestParam String email) {
        return positionService.applicationsStats(email);
    }

    @PutMapping("/application/update")
    public Application updateApplication(@RequestBody Application application) {
        return positionService.updateApplication(application);
    }

    @GetMapping("/searchSalary/{keywords}/{location}")
    public Map<String, Double> searchSalary(@PathVariable String keywords, @PathVariable String location) throws ParseException {
        return positionService.searchSalaries(keywords, location);
    }
}
