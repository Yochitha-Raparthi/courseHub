package com.courseDetails.coursePortal.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.courseDetails.coursePortal.model.Course;

public interface CourseRepo extends JpaRepository<Course,Long>{

}
