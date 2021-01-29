package com.fyp.studentinterfaceservice.controller;

import com.fyp.studentinterfaceservice.model.Position;
import com.fyp.studentinterfaceservice.services.interfaces.PositionService;
import javafx.geometry.Pos;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PositionController {

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

    @GetMapping("/searchPositions/{location}/{keywords}")
    public List<Position> searchPositions(@PathVariable String location, @PathVariable String keywords) {
        return positionService.searchPositions(location, keywords);
    }

    @GetMapping("/searchJobsApi/{location}/{keywords}")
    public List<Position> searchJobApi(@PathVariable String location, @PathVariable String keywords) {
        return positionService.searchJobsApi(location, keywords);
    }
}
