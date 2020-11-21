package com.fyp.studentinterfaceservice.services.interfaces;

import com.fyp.studentinterfaceservice.exceptions.ModuleParsingException;
import com.fyp.studentinterfaceservice.model.Course;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

public interface CourseService {

    ResponseEntity<Course> findCourseById(Long id);

    Course add(Course course) throws ModuleParsingException;
}
