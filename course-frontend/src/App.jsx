import { useCallback, useEffect, useMemo, useState } from "react";

import "./App.css";

import Auth from "./Auth";

const API_URL = "http://localhost:9878/course";

const AUTH_URL = "http://localhost:9878/auth";

const ENROLLMENT_URL = "http://localhost:9878/enrollments";

const emptyCourse = {

  courseName: "",

  trainerName: "",

  duration: "",

  fee: "",

  category: "",

  description: "",

};

const categories = [

  "Programming",

  "Web Development",

  "Data Science",

  "AI & Machine Learning",

  "Cloud Computing",

  "Database",

  "Other",

];

// Read JSON responses and display useful backend errors.

async function readResponse(response) {

  const text = await response.text();

  if (!text) {

    if (!response.ok) {

      throw new Error(`Request failed (${response.status}).`);

    }

    return null;

  }

  let data;

  try {

    data = JSON.parse(text);

  } catch {

    data = text;

  }

  if (!response.ok) {

    if (data && typeof data === "object") {

      const message =

        data.message ||

        data.error ||

        Object.values(data)

          .filter((value) => typeof value === "string")

          .join(" ");

      throw new Error(message || `Request failed (${response.status}).`);

    }

    throw new Error(

      typeof data === "string"

        ? data

        : `Request failed (${response.status}).`

    );

  }

  return data;

}

function App() {

  // Authentication state.

  const [user, setUser] = useState(null);

  const [checkingSession, setCheckingSession] = useState(true);

  // Course state.

  const [courses, setCourses] = useState([]);

  const [myCourses, setMyCourses] = useState([]);

  const [course, setCourse] = useState({ ...emptyCourse });

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [view, setView] = useState("all");

  // Messages and validation.

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});

  // Loading states.

  const [loading, setLoading] = useState(false);

  const [myCoursesLoading, setMyCoursesLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [enrollingId, setEnrollingId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Trust the role returned by the backend.

  const isAdmin = ["ADMIN", "ROLE_ADMIN"].includes(

    String(user?.role ?? "").toUpperCase()

  );

  // Check whether a login session already exists.

  useEffect(() => {

    let active = true;

    async function checkSession() {

      try {

        const response = await fetch(`${AUTH_URL}/me`, {

          method: "GET",

          credentials: "include",

        });

        if (!response.ok) {

          throw new Error("Not logged in");

        }

        const data = await response.json();

        if (active) {

          setUser(data);

        }

      } catch {

        if (active) {

          setUser(null);

        }

      } finally {

        if (active) {

          setCheckingSession(false);

        }

      }

    }

    checkSession();

    return () => {

      active = false;

    };

  }, []);

  // Load all available courses.

  const loadCourses = useCallback(async () => {

    try {

      setLoading(true);

      setError("");

      const response = await fetch(`${API_URL}/getAll`, {

        method: "GET",

        credentials: "include",

      });

      const data = await readResponse(response);

      if (!Array.isArray(data)) {

        throw new Error("The server did not return a valid course list.");

      }

      setCourses(data);

    } catch (err) {

      console.error("Load courses error:", err);

      setError(

        err.message === "Failed to fetch"

          ? "Cannot connect to Spring Boot. Check that the backend is running on port 9878."

          : err.message

      );

    } finally {

      setLoading(false);

    }

  }, []);

  // Load the courses enrolled in by the logged-in user.

  async function loadMyCourses() {

    try {

      setMyCoursesLoading(true);

      setError("");

      const response = await fetch(`${ENROLLMENT_URL}/my-courses`, {

        method: "GET",

        credentials: "include",

      });

      const data = await readResponse(response);

      if (!Array.isArray(data)) {

        throw new Error("The server did not return a valid enrolled-course list.");

      }

      setMyCourses(data);

    } catch (err) {

      console.error("Load my courses error:", err);

      setError(

        err.message === "Failed to fetch"

          ? "Cannot connect to the backend. Check that Spring Boot is running."

          : err.message

      );

    } finally {

      setMyCoursesLoading(false);

    }

  }

  // Load courses after login and clear user-specific state after logout.

  useEffect(() => {

    if (user) {

      loadCourses();

    } else {

      setCourses([]);

      setMyCourses([]);

      setView("all");

      setLoading(false);

    }

  }, [user, loadCourses]);

  // Enroll the logged-in user in a course.

  async function handleEnroll(courseId) {

    try {

      setEnrollingId(courseId);

      setMessage("");

      setError("");

      const response = await fetch(`${ENROLLMENT_URL}/${courseId}`, {

        method: "POST",

        credentials: "include",

      });

      const data = await readResponse(response);

      setMessage(data?.message || "Enrolled successfully!");

      await loadMyCourses();

    } catch (err) {

      console.error("Enrollment error:", err);

      setError(

        err.message === "Failed to fetch"

          ? "Cannot connect to the backend. Check that Spring Boot is running."

          : err.message

      );

    } finally {

      setEnrollingId(null);

    }

  }

  // Load the full details for one course.
  async function handleViewDetails(courseId) {
    try {
      setDetailsLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/getCourseById/${courseId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await readResponse(response);
      setSelectedCourse(data);
    } catch (err) {
      setError(err.message || "Unable to load course details.");
    } finally {
      setDetailsLoading(false);
    }
  }

  // Handle course form field changes.

  function handleChange(event) {

    const { name, value } = event.target;

    setCourse((previous) => ({

      ...previous,

      [name]: value,

    }));

    setFieldErrors((previous) => ({

      ...previous,

      [name]: "",

    }));

    setError("");

    setMessage("");

  }

  // Validate course fields before sending them to the backend.

  function validateCourse() {

    const errors = {};

    if (!course.courseName.trim()) {

      errors.courseName = "Course name is required.";

    } else if (course.courseName.trim().length > 100) {

      errors.courseName = "Course name cannot exceed 100 characters.";

    }

    if (!course.trainerName.trim()) {

      errors.trainerName = "Trainer name is required.";

    } else if (course.trainerName.trim().length > 100) {

      errors.trainerName = "Trainer name cannot exceed 100 characters.";

    }

    if (course.duration === "") {

      errors.duration = "Duration is required.";

    } else if (

      !Number.isInteger(Number(course.duration)) ||

      Number(course.duration) <= 0

    ) {

      errors.duration = "Duration must be a positive whole number.";

    }

    if (course.fee === "") {

      errors.fee = "Fee is required.";

    } else if (

      !Number.isFinite(Number(course.fee)) ||

      Number(course.fee) < 0

    ) {

      errors.fee = "Fee must be zero or greater.";

    }

    if (!course.category.trim()) {

      errors.category = "Please select a category.";

    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;

  }

  // Reset the course form.

  function resetForm() {

    setCourse({ ...emptyCourse });

    setEditId(null);

    setFieldErrors({});

    setError("");

    setMessage("");

  }

  // Create a course or update an existing course.

  async function handleSubmit(event) {

    event.preventDefault();

    setMessage("");

    setError("");

    if (!validateCourse()) {

      return;

    }

    const payload = {

      courseName: course.courseName.trim(),

      trainerName: course.trainerName.trim(),

      duration: Number(course.duration),

      fee: Number(course.fee),

      category: course.category.trim(),

      description: course.description.trim(),

    };

    const isEditing = editId !== null;

    const url = isEditing

      ? `${API_URL}/updateCourse/${editId}`

      : `${API_URL}/create`;

    try {

      setSubmitting(true);

      const response = await fetch(url, {

        method: isEditing ? "PUT" : "POST",

        credentials: "include",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify(payload),

      });

      await readResponse(response);

      setMessage(

        isEditing

          ? "Course updated successfully."

          : "Course created successfully."

      );

      setCourse({ ...emptyCourse });

      setEditId(null);

      setFieldErrors({});

      await loadCourses();

    } catch (err) {

      console.error("Save course error:", err);

      setError(

        err.message === "Failed to fetch"

          ? "Cannot connect to the backend. Check the server and CORS configuration."

          : err.message

      );

    } finally {

      setSubmitting(false);

    }

  }

  // Fill the form with the selected course.

  function handleEdit(selectedCourse) {

    setCourse({

      courseName: selectedCourse.courseName ?? "",

      trainerName: selectedCourse.trainerName ?? "",

      duration: String(selectedCourse.duration ?? ""),

      fee: String(selectedCourse.fee ?? ""),

      category: selectedCourse.category ?? "",

      description: selectedCourse.description ?? "",

    });

    setEditId(selectedCourse.id);

    setFieldErrors({});

    setMessage("");

    setError("");

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  }

  // Delete a course.

  async function handleDelete(id) {

    const confirmed = window.confirm(

      `Are you sure you want to delete course #${id}? This action cannot be undone.`

    );

    if (!confirmed) {

      return;

    }

    setMessage("");

    setError("");

    try {

      setDeletingId(id);

      const response = await fetch(`${API_URL}/deleteCourse/${id}`, {

        method: "DELETE",

        credentials: "include",

      });

      await readResponse(response);

      if (editId === id) {

        setCourse({ ...emptyCourse });

        setEditId(null);

        setFieldErrors({});

      }

      setMessage("Course deleted successfully.");

      await loadCourses();

      await loadMyCourses();

    } catch (err) {

      console.error("Delete course error:", err);

      setError(

        err.message === "Failed to fetch"

          ? "Cannot connect to the backend. Please try again."

          : err.message

      );

    } finally {

      setDeletingId(null);

    }

  }

  // Logout and invalidate the backend session.

  async function handleLogout() {

    setError("");

    setMessage("");

    try {

      const response = await fetch(`${AUTH_URL}/logout`, {

        method: "POST",

        credentials: "include",

      });

      await readResponse(response);

      setUser(null);

      setCourse({ ...emptyCourse });

      setEditId(null);

      setCourses([]);

      setMyCourses([]);

      setSearch("");

      setView("all");

      setFieldErrors({});

    } catch (err) {

      console.error("Logout error:", err);

      setError(err.message || "Unable to log out.");

    }

  }

  // Choose which course list is displayed.

  const displayedCourses = view === "mine" ? myCourses : courses;

  // Search the currently selected course list.

  const filteredCourses = useMemo(() => {

    const query = search.trim().toLowerCase();

    if (!query) {

      return displayedCourses;

    }

    return displayedCourses.filter((item) =>

      [

        item.id,

        item.courseName,

        item.trainerName,

        item.duration,

        item.fee,

        item.category,

      ].some((value) =>

        String(value ?? "").toLowerCase().includes(query)

      )

    );

  }, [displayedCourses, search]);

  if (checkingSession) {

    return <p>Checking login...</p>;

  }

  if (!user) {

    return <Auth onLogin={setUser} />;

  }

  const isShowingMyCourses = view === "mine";

  const isCurrentListLoading = isShowingMyCourses

    ? myCoursesLoading

    : loading;

  return (

    <div className="app">

      <header className="app-header">

        <div className="header-info">

          <p className="eyebrow">COURSE PORTAL</p>

          <h1>Course Management</h1>

          <p className="subtitle">

            Browse courses and manage your learning in one place.

          </p>

          <p className="subtitle">

            Logged in as: {user.email || user.name || "User"}

            {" — "}

            {isAdmin ? "Admin" : "User"}

          </p>

        </div>

        <div className="header-actions">

          <div className="header-count">

            <span>Total courses</span>

            <strong>{courses.length}</strong>

          </div>

          <button

            type="button"

            className="button logout-button"

            onClick={handleLogout}

          >

            Logout

          </button>

        </div>

      </header>

      <main className="main-content">

        {message && (

          <div className="alert success-alert" role="status">

            <span>{message}</span>

            <button

              type="button"

              className="alert-close"

              aria-label="Dismiss success message"

              onClick={() => setMessage("")}

            >

              ×

            </button>

          </div>

        )}

        {error && (

          <div className="alert error-alert" role="alert">

            <span>{error}</span>

            <button

              type="button"

              className="alert-close"

              aria-label="Dismiss error message"

              onClick={() => setError("")}

            >

              ×

            </button>

          </div>

        )}

        {isAdmin && (

          <section className="panel form-panel">

            <div className="section-heading">

              <div>

                <h2>

                  {editId !== null ? "Edit course" : "Add a new course"}

                </h2>

                <p>

                  {editId !== null

                    ? `Update the details for course #${editId}.`

                    : "Enter the course information below."}

                </p>

              </div>

              {editId !== null && (

                <span className="edit-badge">Editing</span>

              )}

            </div>

            <form onSubmit={handleSubmit} noValidate>

              <div className="form-grid">

                <div className="form-group">

                  <label htmlFor="courseName">Course name \*</label>

                  <input

                    id="courseName"

                    name="courseName"

                    value={course.courseName}

                    onChange={handleChange}

                    placeholder="e.g. Java Full Stack"

                    maxLength={100}

                    aria-invalid={Boolean(fieldErrors.courseName)}

                  />

                  {fieldErrors.courseName && (

                    <small className="field-error">

                      {fieldErrors.courseName}

                    </small>

                  )}

                </div>

                <div className="form-group">

                  <label htmlFor="trainerName">Trainer name \*</label>

                  <input

                    id="trainerName"

                    name="trainerName"

                    value={course.trainerName}

                    onChange={handleChange}

                    placeholder="e.g. Ravi Kumar"

                    maxLength={100}

                    aria-invalid={Boolean(fieldErrors.trainerName)}

                  />

                  {fieldErrors.trainerName && (

                    <small className="field-error">

                      {fieldErrors.trainerName}

                    </small>

                  )}

                </div>

                <div className="form-group">

                  <label htmlFor="duration">Duration (days) \*</label>

                  <input

                    id="duration"

                    name="duration"

                    type="number"

                    min="1"

                    step="1"

                    value={course.duration}

                    onChange={handleChange}

                    placeholder="e.g. 30"

                    aria-invalid={Boolean(fieldErrors.duration)}

                  />

                  {fieldErrors.duration && (

                    <small className="field-error">

                      {fieldErrors.duration}

                    </small>

                  )}

                </div>

                <div className="form-group">

                  <label htmlFor="fee">Course fee (₹) \*</label>

                  <input

                    id="fee"

                    name="fee"

                    type="number"

                    min="0"

                    step="0.01"

                    value={course.fee}

                    onChange={handleChange}

                    placeholder="e.g. 15000"

                    aria-invalid={Boolean(fieldErrors.fee)}

                  />

                  {fieldErrors.fee && (

                    <small className="field-error">

                      {fieldErrors.fee}

                    </small>

                  )}

                </div>

                <div className="form-group full-width">

                  <label htmlFor="category">Category \*</label>

                  <select

                    id="category"

                    name="category"

                    value={course.category}

                    onChange={handleChange}

                    aria-invalid={Boolean(fieldErrors.category)}

                  >

                    <option value="">Select a category</option>

                    {categories.map((category) => (

                      <option key={category} value={category}>

                        {category}

                      </option>

                    ))}

                  </select>

                  {fieldErrors.category && (

                    <small className="field-error">

                      {fieldErrors.category}

                    </small>

                  )}

                </div>

                <div className="form-group full-width">

                  <label htmlFor="description">Course description</label>

                  <textarea

                    id="description"

                    name="description"

                    value={course.description}

                    onChange={handleChange}

                    placeholder="Describe the course, topics covered, and skills students will learn..."

                    maxLength={2000}

                    rows={5}

                  />

                  <small>{course.description.length}/2000 characters</small>

                </div>

              </div>

              <p className="required-note">\* Required fields</p>

              <div className="form-actions">

                <button

                  type="submit"

                  className="button primary-button"

                  disabled={submitting}

                >

                  {submitting

                    ? "Saving..."

                    : editId !== null

                      ? "Update course"

                      : "Create course"}

                </button>

                <button

                  type="button"

                  className="button secondary-button"

                  onClick={resetForm}

                  disabled={submitting}

                >

                  {editId !== null ? "Cancel edit" : "Reset"}

                </button>

              </div>

            </form>

          </section>

        )}

        {/* {selectedCourse && (
          <section className="panel course-details-panel">
            <div className="section-heading">
              <div>
                <h2>{selectedCourse.courseName || "Course details"}</h2>
                <p>More information about this course.</p>
              </div>
              <button
                type="button"
                className="button secondary-button"
                onClick={() => setSelectedCourse(null)}
              >
                Close
              </button>
            </div>
            <p><strong>Course ID:</strong> {selectedCourse.id}</p>
            <p><strong>Trainer:</strong> {selectedCourse.trainerName || "Not specified"}</p>
            <p><strong>Duration:</strong> {selectedCourse.duration} days</p>
            <p>
              <strong>Fee:</strong>{" "}
              {Number(selectedCourse.fee ?? 0).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
              })}
            </p>
            <p><strong>Category:</strong> {selectedCourse.category || "Not specified"}</p>
            <div className="course-description">
              <h3>Description</h3>
              <p>
                {selectedCourse.description?.trim() ||
                  "No description has been added for this course yet."}
              </p>
            </div>
          </section>
        )} */}

                {selectedCourse && (
          <section className="panel course-details-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow details-eyebrow">COURSE OVERVIEW</p>
                <h2>{selectedCourse.courseName || "Course details"}</h2>
                <p>Everything you need to know about this course.</p>
              </div>

              <button
                type="button"
                className="button secondary-button details-close"
                onClick={() => setSelectedCourse(null)}
              >
                Close
              </button>
            </div>

            <div className="course-details-content">
              <div className="course-detail-item">
                <strong>Course ID</strong>
                <span>{selectedCourse.id ?? "N/A"}</span>
              </div>

              <div className="course-detail-item">
                <strong>Trainer</strong>
                <span>{selectedCourse.trainerName || "Not specified"}</span>
              </div>

              <div className="course-detail-item">
                <strong>Duration</strong>
                <span>
                  {selectedCourse.duration != null
                    ? `${selectedCourse.duration} days`
                    : "Not specified"}
                </span>
              </div>

              <div className="course-detail-item">
                <strong>Course Fee</strong>
                <span>
                  {Number(selectedCourse.fee ?? 0).toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="course-detail-item">
                <strong>Category</strong>
                <span>{selectedCourse.category || "Not specified"}</span>
              </div>
            </div>

            <div className="course-detail-description">
              <h3>Description</h3>
              <p>
                {selectedCourse.description?.trim() ||
                  "No description has been added for this course yet."}
              </p>
            </div>
          </section>
        )}

        <section className="panel courses-panel">

          <div className="section-heading courses-heading">

            <div>

              <h2>{isShowingMyCourses ? "My Courses" : "All Courses"}</h2>

              <p>

                {isShowingMyCourses

                  ? "Courses you have enrolled in."

                  : isAdmin

                    ? "View and manage the available courses."

                    : "Browse the available courses and enroll in one."}

              </p>

            </div>

            <div className="header-actions">

              <button

                type="button"

                className="button secondary-button"

                onClick={() => {

                  setView("all");

                  setSearch("");

                }}

                disabled={view === "all"}

              >

                All Courses

              </button>

              {!isAdmin && (

                <button

                  type="button"

                  className="button secondary-button"

                  onClick={async () => {

                    setView("mine");

                    setSearch("");

                    await loadMyCourses();

                  }}

                  disabled={isShowingMyCourses && myCoursesLoading}

                >

                  My Courses

                </button>

              )}

              <button

                type="button"

                className="button secondary-button refresh-button"

                onClick={

                  isShowingMyCourses ? loadMyCourses : loadCourses

                }

                disabled={isCurrentListLoading}

              >

                {isCurrentListLoading ? "Loading..." : "Refresh"}

              </button>

            </div>

          </div>

          <div className="table-toolbar">

            <input

              type="search"

              value={search}

              onChange={(event) => setSearch(event.target.value)}

              placeholder="Search courses, trainers, categories..."

              aria-label="Search courses"

            />

            <span className="result-count">

              {filteredCourses.length} result

              {filteredCourses.length === 1 ? "" : "s"}

            </span>

          </div>

          {isCurrentListLoading ? (

            <div className="table-state">

              <div className="spinner" />

              <p>Loading courses...</p>

            </div>

          ) : displayedCourses.length === 0 ? (

            <div className="table-state">

              <h3>

                {isShowingMyCourses

                  ? "No enrolled courses yet"

                  : "No courses yet"}

              </h3>

              <p>

                {isShowingMyCourses

                  ? "Enroll in a course to see it here."

                  : isAdmin

                    ? "Create your first course using the form above."

                    : "No courses are currently available."}

              </p>

            </div>

          ) : filteredCourses.length === 0 ? (

            <div className="table-state">

              <h3>No matching courses</h3>

              <p>Try another search term.</p>

            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>

                    <th>ID</th>

                    <th>Course</th>

                    <th>Trainer</th>

                    <th>Duration</th>

                    <th>Fee</th>

                    <th>Category</th>

                    <th>Details</th>
                    {!isAdmin && !isShowingMyCourses && (

                      <th>Enrollment</th>

                    )}

                    {isAdmin && <th>Actions</th>}

                  </tr>

                </thead>

                <tbody>

                  {filteredCourses.map((item) => (

                    <tr key={item.id}>

                      <td>{item.id}</td>

                      <td className="course-cell">{item.courseName}</td>

                      <td>{item.trainerName}</td>

                      <td>{item.duration} days</td>

                      <td>

                        {Number(item.fee).toLocaleString("en-IN", {

                          style: "currency",

                          currency: "INR",

                          maximumFractionDigits: 2,

                        })}

                      </td>

                      <td>

                        <span className="category-tag">{item.category}</span>

                      </td>

                      <td>
                        <button
                          type="button"
                          className="button secondary-button"
                          onClick={() => handleViewDetails(item.id)}
                          disabled={detailsLoading}
                        >
                          {detailsLoading ? "Loading..." : "View details"}
                        </button>
                      </td>

                      {!isAdmin && !isShowingMyCourses && (

                        <td>

                          <button

                            type="button"

                            className="button primary-button"

                            onClick={() => handleEnroll(item.id)}

                            disabled={enrollingId !== null}

                          >

                            {enrollingId === item.id

                              ? "Enrolling..."

                              : "Enroll"}

                          </button>

                        </td>

                      )}

                      {isAdmin && (

                        <td>

                          <div className="row-actions">

                            <button

                              type="button"

                              className="action-button edit-button"

                              onClick={() => handleEdit(item)}

                              disabled={

                                submitting || deletingId !== null

                              }

                            >

                              Edit

                            </button>

                            <button

                              type="button"

                              className="action-button delete-button"

                              onClick={() => handleDelete(item.id)}

                              disabled={

                                submitting ||

                                deletingId !== null ||

                                loading

                              }

                            >

                              {deletingId === item.id

                                ? "Deleting..."

                                : "Delete"}

                            </button>

                          </div>

                        </td>

                      )}

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

        <footer className="app-footer">

          Course Portal · React + Spring Boot

        </footer>

      </main>

    </div>

  );

}

export default App;
