package com.fyp.studentinterfaceservice.services.interfaces;

import com.fyp.studentinterfaceservice.model.Position;

import java.util.List;

public interface PositionService {

    List<Position> getAllPositions();

    Position getPosition(Long id);

}
