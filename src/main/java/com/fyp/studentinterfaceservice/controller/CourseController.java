package com.fyp.studentinterfaceservice.controller;

import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.exceptions.ModuleParsingException;
import com.fyp.studentinterfaceservice.model.Course;
import com.fyp.studentinterfaceservice.services.interfaces.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CourseController {

    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping("/addCourse")
    public Course add(@RequestBody Course course) throws ModuleParsingException {
        return courseService.add(course);
    }

    @GetMapping("/getCourses")
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }
}
