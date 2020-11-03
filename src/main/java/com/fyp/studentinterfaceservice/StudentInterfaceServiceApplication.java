package com.fyp.studentinterfaceservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class StudentInterfaceServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentInterfaceServiceApplication.class, args);
    }

}
