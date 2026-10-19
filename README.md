# CourseHub – Course Enrollment Management System

A full-stack course management application built with **React.js, Java, Spring Boot, and MySQL**. CourseHub allows users to explore courses, view course details, enroll in courses, and manage their enrollments. Administrators can manage the course catalog through a role-based dashboard.

## 📌 About the Project

CourseHub is designed to simplify course discovery and enrollment through a user-friendly web interface. The application separates the public landing page, authentication pages, and role-based dashboards to provide a structured user experience.

After logging in, users are redirected to the appropriate dashboard according to the role returned by the backend.

## ✨ Features

### User Features
- **User Registration:** Create an account through a separate signup page.
- **Secure Login:** Authenticate using registered credentials.
- **Course Catalog:** Browse available courses.
- **Course Details:** View course information, including trainer, duration, fee, category, and description.
- **Search and Filtering:** Find courses using supported search and filtering options.
- **Course Enrollment:** Enroll in available courses.
- **My Courses:** View courses associated with the logged-in user.
- **Enrollment Cancellation:** Cancel an enrollment if supported by the backend implementation.
- **Logout:** End the authenticated session.

### Admin Features
- **Admin Dashboard:** Access course management functionality based on the assigned role.
- **Add Courses:** Create new course records.
- **Update Courses:** Edit existing course information.
- **Delete Courses:** Remove courses from the catalog.
- **View Course Details:** Inspect individual course information.
- **Role-Based Access:** Restrict administrative functionality to authorized administrators.

### User Interface
- Separate landing, login, and signup pages.
- Dedicated routes for user and admin dashboards.
- Responsive React-based interface.
- Form validation and success/error messages.
- Course search, tables, and course details views.
- Navigation based on authentication status and user role.

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- React Router DOM
- Axios, if used by the current implementation
- Vite

### Backend
- Java
- Spring Boot
- Spring Web MVC
- Spring Data JPA
- Spring Security
- Hibernate ORM
- Maven
- Bean Validation

### Database
- MySQL

### Authentication and Security
- Spring Security
- BCrypt password hashing
- Session-based authentication
- Role-based authorization
- Credentialed frontend-to-backend requests

## 🏗️ Project Architecture

The backend follows a layered architecture to separate responsibilities.

- **Controller Layer:** Receives HTTP requests and exposes REST API endpoints.
- **Service Layer:** Implements application and business logic.
- **Repository Layer:** Uses Spring Data JPA to communicate with the database.
- **Entity Layer:** Represents application data, including users, courses, and enrollments.
- **Configuration Layer:** Configures security, authentication, and cross-origin requests.
- **Frontend Layer:** Provides the landing page, authentication forms, dashboards, and course management interface.

### Application Flow

```text
User
  |
  v
React.js Frontend
  |
  +--> Landing Page
  |
  +--> Login / Signup
  |
  +--> User Dashboard
  |       |
  |       +--> Browse Courses
  |       +--> View Course Details
  |       +--> Enroll in Courses
  |       +--> View My Courses
  |
  +--> Admin Dashboard
          |
          +--> Add Courses
          +--> Update Courses
          +--> Delete Courses
  |
  v
Spring Boot REST APIs
  |
  v
Service Layer
  |
  v
Spring Data JPA / Hibernate
  |
  v
MySQL Database
```

The frontend communicates with the backend through REST APIs. The backend validates requests, applies business rules, interacts with MySQL, and returns responses to the frontend.

## 🔐 Authentication and Role-Based Navigation

CourseHub uses session-based authentication.

1. A new user registers through the signup page.
2. The user logs in through the separate login page.
3. The frontend sends the login request to the Spring Boot backend.
4. The backend authenticates the user and establishes the session.
5. The frontend checks the authenticated user's information and role.
6. Normal users are redirected to the user dashboard.
7. Administrators are redirected to the admin dashboard.
8. On logout, the frontend requests session termination from the backend.

Public registration should create normal `USER` accounts by default. Administrative access should be assigned only through a trusted administrative process.

**Security note:** Frontend route protection improves navigation, but the backend must also enforce authorization for administrative API operations.

## 🗄️ Database Design

The application uses MySQL to persist user, course, and enrollment information.

### Main Tables

| Table | Purpose |
|---|---|
| `app_users` | Stores user details, password hashes, and roles. |
| `course` | Stores course names, trainers, duration, fees, categories, and descriptions. |
| `enrollments` | Stores user-course enrollment records, dates, and status. |

### Relationships

- One user can enroll in multiple courses.
- One course can have multiple enrolled users.
- The `enrollments` table connects users and courses.

This creates a many-to-many relationship between users and courses through enrollment records.

## 📁 Project Structure

The following is the expected high-level structure. Exact filenames and folders may vary depending on the current implementation.

```text
CourseHub/
├── coursePortal/
│   ├── src/main/java/com/courseDetails/coursePortal/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── exception/
│   │   ├── model/
│   │   ├── repo/
│   │   └── service/
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── mvnw.cmd
│
├── customer-portal-ui/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── CourseDashboard.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## ⚙️ Prerequisites

Install the following software before running the project:

- Java version compatible with the project configuration.
- MySQL Server.
- Node.js and npm.
- Git.
- An IDE such as IntelliJ IDEA or Eclipse.
- A terminal or command prompt.

Check your installed versions:

```bash
java -version
node -v
npm -v
git --version
```

## 🚀 How to Run the Project

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd CourseHub
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual repository URL.

### 2. Create the Database

Open MySQL and execute:

```sql
CREATE DATABASE coursehub;
```

Use the database name configured in your backend application.

### 3. Configure the Backend

Open:

`coursePortal/src/main/resources/application.properties`

Configure the database URL, username, and password using the settings supported by your application.

Example environment variables:

```text
COURSE_DB_URL=jdbc:mysql://localhost:3306/coursehub
COURSE_DB_USERNAME=your_mysql_username
COURSE_DB_PASSWORD=your_mysql_password
```

These variable names must match those referenced in your actual `application.properties` file.

Do not commit real database passwords, API keys, or other secrets to GitHub.

### 4. Start the Spring Boot Backend

Open a terminal inside the `coursePortal` directory.

On Windows:

```bash
mvnw.cmd spring-boot:run
```

On macOS or Linux:

```bash
./mvnw spring-boot:run
```

The backend is configured to run at:

`http://localhost:9878`

If the Maven wrapper is unavailable, install Maven and use `mvn spring-boot:run`.

### 5. Start the React Frontend

Open another terminal inside the `customer-portal-ui` directory.

Install the frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal. It is commonly:

`http://localhost:5173`

Keep both the backend and frontend running while testing the application.

## 🔗 API Endpoints

The following endpoints describe the API structure. Confirm them against your current controller mappings if your implementation differs.

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/auth/signup` | Register a new user. |
| `POST` | `/auth/login` | Authenticate a user. |
| `GET` | `/auth/me` | Retrieve the current session's user information. |
| `POST` | `/auth/logout` | End the authenticated session. |

### Course Management

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/course/getAll` | Retrieve available courses. |
| `GET` | `/course/getCourseById/{id}` | Retrieve course details. |
| `POST` | `/course/create` | Create a course; admin access required. |
| `PUT` | `/course/updateCourse/{id}` | Update a course; admin access required. |
| `PATCH` | `/course/updatecourseDetails/{id}` | Partially update course details, if implemented. |
| `DELETE` | `/course/deleteCourse/{id}` | Delete a course; admin access required. |

The course listing may support optional search, category, or maximum-fee parameters when implemented by the backend.

### Enrollment Management

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/enrollments/{courseId}` | Enroll in a course. |
| `GET` | `/enrollments/mine` | Retrieve the current user's enrollments, if this is the configured route. |
| `DELETE` | `/enrollments/{courseId}` | Cancel an enrollment, if implemented. |

Enrollment operations should require authentication. The exact endpoint names must match your backend controllers.

## 👤 Creating an Admin Account

Public signup should create a normal user account. To test the admin dashboard:

1. Register an account using the signup page.
2. Open MySQL and locate the account in the `app_users` table.
3. Assign the admin role using the schema and role format configured by your application.
4. Log out and log in again so the application retrieves the updated role.

Example only — confirm your actual column names and role values before executing:

```sql
UPDATE app_users
SET role = 'ADMIN'
WHERE id = YOUR_USER_ID;
```

Replace `YOUR_USER_ID` with the correct account ID. Do not expose administrator credentials or give public users the ability to assign themselves admin roles.

## 📚 Learning Outcomes

This project provides practical experience with:

- Building REST APIs using Spring Boot.
- Developing React components and multi-page navigation.
- Connecting a frontend to a Java backend.
- Working with MySQL, Hibernate, and Spring Data JPA.
- Implementing CRUD operations.
- Handling user registration, login, and logout.
- Using session-based authentication.
- Applying role-based access control.
- Organizing a backend into controller, service, and repository layers.
- Managing application source code with Git and GitHub.

## 🔮 Future Enhancements

- Add course ratings and reviews.
- Implement pagination for large course catalogs.
- Add automated unit and integration tests.
- Improve accessibility and form validation.
- Add course completion tracking.
- Introduce email verification and password reset.
- Consider online payment integration.
- Improve security monitoring and production deployment configuration.

## 👩‍💻 Author

**Yochitha Raparthi**

Full-Stack Development Project — CourseHub
