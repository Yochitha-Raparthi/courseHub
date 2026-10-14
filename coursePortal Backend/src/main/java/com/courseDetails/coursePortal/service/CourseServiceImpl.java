
package com.courseDetails.coursePortal.service;

import com.courseDetails.coursePortal.model.Course;
import com.courseDetails.coursePortal.repo.CourseRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepo courseRepo;

    public CourseServiceImpl(CourseRepo courseRepo) {
        this.courseRepo = courseRepo;
    }

    @Override
    public Course createCourse(Course course) {
        // Saves all fields, including description
        return courseRepo.save(course);
    }

    @Override
    public List<Course> getAllCourses() {
        return courseRepo.findAll();
    }

    @Override
    public Course getCourseById(Long id) {
        return courseRepo.findById(id).orElseThrow(() ->
                new RuntimeException("Course not found with ID: " + id));
    }

    @Override
    public Course updateCourse(Long id, Course course) {
        Course existing = getCourseById(id);

        existing.setCourseName(course.getCourseName());
        existing.setTrainerName(course.getTrainerName());
        existing.setDuration(course.getDuration());
        existing.setFee(course.getFee());
        existing.setCategory(course.getCategory());
        existing.setDescription(course.getDescription()); // Added

        return courseRepo.save(existing);
    }

    @Override
    public Course updateCourseDetails(Long id, Course course) {
        Course existing = getCourseById(id);

        if (course.getCourseName() != null)
            existing.setCourseName(course.getCourseName());

        if (course.getTrainerName() != null)
            existing.setTrainerName(course.getTrainerName());

        if (course.getDuration() != null)
            existing.setDuration(course.getDuration());

        if (course.getFee() != null)
            existing.setFee(course.getFee());

        if (course.getCategory() != null)
            existing.setCategory(course.getCategory());

        if (course.getDescription() != null)
            existing.setDescription(course.getDescription()); // Added

        return courseRepo.save(existing);
    }

    @Override
    public void deleteCourse(Long id) {
        courseRepo.delete(getCourseById(id));
    }
}
