
package com.courseDetails.coursePortal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record CourseRequest(
    @NotBlank(message = "Course name is required")
    @Size(max = 100)
    String courseName,

    @NotBlank(message = "Trainer name is required")
    @Size(max = 100)
    String trainerName,

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    Integer duration,

    @NotNull(message = "Fee is required")
    @PositiveOrZero(message = "Fee must be zero or greater")
    Double fee,

    @NotBlank(message = "Category is required")
    String category,

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    String description
) {}

