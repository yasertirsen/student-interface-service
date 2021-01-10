package com.fyp.studentinterfaceservice.services;

import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.exceptions.ModuleParsingException;
import com.fyp.studentinterfaceservice.model.Course;
import com.fyp.studentinterfaceservice.model.Module;
import com.fyp.studentinterfaceservice.model.User;
import com.fyp.studentinterfaceservice.services.interfaces.CourseService;
import com.fyp.studentinterfaceservice.services.interfaces.UserService;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CourseServiceImpl implements CourseService {

    private final ProgradClient client;
    private final UserService userService;

    @Value("${token.secret}")
    private String bearerToken;

    public CourseServiceImpl(ProgradClient client, UserService userService) {
        this.client = client;
        this.userService = userService;
    }

    @Override
    public ResponseEntity<Course> findCourseById(Long id) {
        return client.findCourseById(bearerToken, id);
    }

    @Override
    public Course add(Course course) throws ModuleParsingException {
        if(!course.getUrl().isEmpty()
                && course.getUniversity().equalsIgnoreCase("TUD")) {
            return client.addCourse(bearerToken, getTudCourseDetails(course));
        }
        return client.addCourse(bearerToken, course);
    }

    @Override
    public List<Course> getAllCourses() {
        return client.getAllCourses(bearerToken);
    }

    private Course getTudCourseDetails(Course course) throws ModuleParsingException {
        Set<Module> modules = new HashSet<>();
        String level = "level";
        try {
            final Document doc = Jsoup.connect(course.getUrl()).get();

            course.setName(doc.select("h1.hero-banner__h").first().text().split(" /")[0]);
            for(Element el : doc.select("p:nth-of-type(2)")) {
                if (el.text().toLowerCase().contains(level.toLowerCase())) {
                    course.setLevel(el.text());
                }
            }

            for(Element result: doc.select(
                    "div.tab-pane > ul > li")) {
                Module module = new Module();
                module.setName(result.select("li").text());
                modules.add(module);
            }
            course.setModules(modules);
            course.setUniversity("Technological University Dublin");
        } catch (Exception ex) {
            throw new ModuleParsingException();
        }
        return course;
    }
}
