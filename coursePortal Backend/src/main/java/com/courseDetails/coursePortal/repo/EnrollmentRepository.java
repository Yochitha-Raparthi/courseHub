package com.courseDetails.coursePortal.repo;

import com.courseDetails.coursePortal.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository
        extends JpaRepository<Enrollment, Long> {

    boolean existsByUser_IdAndCourse_Id(
        Long userId,
        Long courseId
    );

    List<Enrollment> findByUser_Id(Long userId);
}
