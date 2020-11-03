package com.fyp.studentinterfaceservice.controller;

import com.fyp.studentinterfaceservice.client.StudentClient;
import com.fyp.studentinterfaceservice.dto.Student;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
public class StudentController {

    private final StudentClient client;

    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return client.getAllStudents();
    }
}
