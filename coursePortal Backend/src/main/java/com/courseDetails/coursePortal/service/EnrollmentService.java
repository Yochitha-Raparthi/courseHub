package com.courseDetails.coursePortal.service;

import com.courseDetails.coursePortal.model.Course;
import java.util.List;

public interface EnrollmentService {

    void enroll(String email, Long courseId);

    List<Course> getMyCourses(String email);
}