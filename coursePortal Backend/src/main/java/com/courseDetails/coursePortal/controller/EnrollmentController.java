
package com.courseDetails.coursePortal.controller;

import com.courseDetails.coursePortal.model.Course;
import com.courseDetails.coursePortal.service.EnrollmentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(
            EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/{courseId}")
    public ResponseEntity<?> enroll(
            @PathVariable Long courseId,
            Authentication authentication) {

        enrollmentService.enroll(
            authentication.getName(), courseId);

        return ResponseEntity.status(HttpStatus.CREATED).body(
            Map.of("message", "Enrolled successfully")
        );
    }

    @GetMapping("/my-courses")
    public ResponseEntity<List<Course>> getMyCourses(
            Authentication authentication) {

        List<Course> courses =
            enrollmentService.getMyCourses(
                authentication.getName());

        return ResponseEntity.ok(courses);
    }
}
