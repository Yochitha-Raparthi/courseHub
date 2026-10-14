
package com.courseDetails.coursePortal.service;

import com.courseDetails.coursePortal.model.AppUser;
import com.courseDetails.coursePortal.model.Course;
import com.courseDetails.coursePortal.model.Enrollment;
import com.courseDetails.coursePortal.repo.CourseRepo;
import com.courseDetails.coursePortal.repo.EnrollmentRepository;
import com.courseDetails.coursePortal.repo.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepo courseRepo;

    public EnrollmentServiceImpl(
            EnrollmentRepository enrollmentRepository,
            UserRepository userRepository,
            CourseRepo courseRepo) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepo = courseRepo;
    }

    @Override
    @Transactional
    public void enroll(String email, Long courseId) {

        AppUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"));

        Course course = courseRepo.findById(courseId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Course not found"));

        if (enrollmentRepository.existsByUser_IdAndCourse_Id(
                user.getId(), course.getId())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "You are already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);

        enrollmentRepository.save(enrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Course> getMyCourses(String email) {

        AppUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"));

        return enrollmentRepository.findByUser_Id(user.getId())
            .stream()
            .map(Enrollment::getCourse)
            .toList();
    }
}