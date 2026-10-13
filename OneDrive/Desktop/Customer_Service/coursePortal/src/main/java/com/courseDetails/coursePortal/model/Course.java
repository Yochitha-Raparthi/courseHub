
package com.courseDetails.coursePortal.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "course")
@Getter
@Setter
@NoArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Course name is required")
    @Size(max = 100, message = "Course name cannot exceed 100 characters")
    private String courseName;

    @NotBlank(message = "Trainer name is required")
    @Size(max = 100, message = "Trainer name cannot exceed 100 characters")
    private String trainerName;

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be greater than zero")
    private Integer duration;

    @NotNull(message = "Fee is required")
    @PositiveOrZero(message = "Fee cannot be negative")
    private Double fee;

    @NotBlank(message = "Category is required")
    private String category;
}