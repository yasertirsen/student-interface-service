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

    @Value("${token.secret}")
    private String SECRET_TOKEN;

    public CourseServiceImpl(ProgradClient client) {
        this.client = client;
    }

    @Override
    public ResponseEntity<Course> findCourseById(Long id) {
        return client.findCourseById(SECRET_TOKEN, id);
    }

    @Override
    public Course add(Course course) throws ModuleParsingException {
        if(!course.getUrl().isEmpty()
                && course.getUniversity().equalsIgnoreCase("Technological University Dublin")
                || course.getUniversity().equalsIgnoreCase("TU Dublin")
                || course.getUniversity().equalsIgnoreCase("TUD")) {
            try {
                return client.addCourse(SECRET_TOKEN, getTudCourseDetails(course));
            }
            catch (ModuleParsingException e) {
                return client.addCourse(SECRET_TOKEN, course);
            }
        }
        return client.addCourse(SECRET_TOKEN, course);
    }

    @Override
    public List<Course> getAllCourses() {
        return client.getAllCourses(SECRET_TOKEN);
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
