package com.fyp.studentinterfaceservice.client;

import com.fyp.studentinterfaceservice.dto.Student;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

import static com.fyp.studentinterfaceservice.constants.Constants.STUDENT_CLIENT;
import static com.fyp.studentinterfaceservice.constants.Constants.STUDENT_CLIENT_URL;

@FeignClient(url = STUDENT_CLIENT_URL, name = STUDENT_CLIENT)
public interface StudentClient {

    @GetMapping("/all")
    public List<Student> getAllStudents();
}
