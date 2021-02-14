package com.fyp.studentinterfaceservice.services.interfaces;

import com.fyp.studentinterfaceservice.model.Position;

import java.util.List;

public interface PositionService {

    List<Position> getAllPositions();

    Position getPosition(Long id);

    List<Position> searchPositions(String location, String keywords);

    List<Position> searchJobsApi(String location, String keywords);

    List<Position> getCompanyPositions(Long companyId);
}
