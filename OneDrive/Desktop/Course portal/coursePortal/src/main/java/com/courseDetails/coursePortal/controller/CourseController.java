package com.courseDetails.coursePortal.controller;

import com.courseDetails.coursePortal.model.Course;
import com.courseDetails.coursePortal.service.CourseService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/course")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping("/create")
    public Course createCourse(@Valid @RequestBody Course course) {
        return courseService.createCourse(course);
    }

    @GetMapping("/getAll")
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/getCourseById/{id}")
    public Course getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    @PutMapping("/updateCourse/{id}")
    public Course updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody Course course) {
        return courseService.updateCourse(id, course);
    }

    @PatchMapping("/updatecourseDetails/{id}")
    public Course updateCourseDetails(
            @PathVariable Long id,
            @RequestBody Course course) {
        return courseService.updateCourseDetails(id, course);
    }

    @DeleteMapping("/deleteCourse/{id}")
    public String deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return "Course " + id + " deleted successfully";
    }
}