package com.fyp.studentinterfaceservice.services;

import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.model.Position;
import com.fyp.studentinterfaceservice.services.interfaces.PositionService;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.fyp.studentinterfaceservice.client.ProgradClient.bearerToken;

@Service
public class PositionServiceImpl implements PositionService {

    private final ProgradClient client;

    public PositionServiceImpl(ProgradClient client) {
        this.client = client;
    }

    @Override
    public List<Position> getAllPositions() {
        return client.getAllPositions(bearerToken);
    }

    @Override
    public Position getPosition(Long id) {
        return client.findPositionById(bearerToken, id);
    }
}
