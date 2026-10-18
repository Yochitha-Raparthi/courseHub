# CourseHub – Course Enrollment Management System

## About the Project

CourseHub is a full-stack web application developed using React.js, Java, Spring Boot, and MySQL. It provides a platform where users can explore available courses, view course details, and enroll in courses. Administrators can manage course information through the application.

## Features

- **User Registration and Login:** Users can create an account and log in securely.
- **Course Catalog:** View available courses and their details.
- **Course Search and Filtering:** Search courses by name or trainer, filter by category, and set a maximum fee.
- **Course Enrollment:** Enroll in courses and view personal enrollments.
- **Enrollment Cancellation:** Allow users to cancel their enrollments.
- **Admin Course Management:** Add, update, and delete courses.
- **Role-Based Access Control:** Restrict administrative operations to authorized admins.
- **Responsive User Interface:** Access the application through a React-based web interface.

## Technologies Used

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- Vite

### Backend
- Java
- Spring Boot
- Spring Web MVC
- Spring Data JPA
- Spring Security
- Hibernate
- Maven
- Bean Validation

### Database
- MySQL

### Security
- Spring Security
- BCrypt password hashing
- Session-based authentication

## Project Architecture

The backend follows a layered architecture:

- **Controller Layer:** Handles HTTP requests and REST API endpoints.
- **Service Layer:** Contains application logic and course management operations.
- **Repository Layer:** Uses Spring Data JPA to interact with the database.
- **Entity Layer:** Represents database tables such as users, courses, and enrollments.
- **Configuration Layer:** Configures security, authentication, and CORS.

### Application Flow

React.js Frontend → REST APIs → Spring Boot Backend → Spring Data JPA → MySQL Database

The backend processes requests and returns responses to the frontend, which displays the results to the user.

## Database Design

The application uses MySQL to store its data.

- **app_users:** Stores user information, password hashes, and roles.
- **course:** Stores course names, trainer details, duration, fees, and categories.
- **enrollments:** Stores user-course enrollment details, enrollment dates, and status.

The enrollment records connect users with courses.

## Project Structure

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
│   └── pom.xml
│
├── customer-portal-ui/
│   ├── src/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Prerequisites

Install the following before running the project:

- Java version compatible with the project configuration (Java 25 in the current `pom.xml`)
- MySQL Server
- Node.js and npm
- Git
- An IDE such as Eclipse or IntelliJ IDEA

## How to Run the Project

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd CourseHub
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Create the Database

Open MySQL and run:

```sql
CREATE DATABASE coursehub;
```

### 3. Configure the Backend

The backend configuration is in:

`coursePortal/src/main/resources/application.properties`

Set the database connection using these environment variables:

- `COURSE_DB_URL` — defaults to `jdbc:mysql://localhost:3306/coursehub`
- `COURSE_DB_USERNAME` — your MySQL username
- `COURSE_DB_PASSWORD` — your MySQL password

For local development, the application uses Hibernate's `update` setting to create or update database tables.

Do not commit database passwords or other secrets to GitHub.

### 4. Start the Backend

Open a terminal inside the `coursePortal` folder.

On Windows:

```bash
mvnw.cmd spring-boot:run
```

On macOS or Linux:

```bash
./mvnw spring-boot:run
```

The backend runs at:

`http://localhost:9878`

### 5. Start the Frontend

Open another terminal inside the `customer-portal-ui` folder.

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite, normally:

`http://localhost:5173`

## API Endpoints

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/signup` | Register a user |
| POST | `/auth/login` | Log in |
| GET | `/auth/me` | Get current user information |
| POST | `/auth/logout` | Log out |

### Course Management

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/course/getAll` | View courses, with optional filters |
| GET | `/course/getCourseById/{id}` | Get course details |
| POST | `/course/create` | Add a course (admin) |
| PUT | `/course/updateCourse/{id}` | Update a course (admin) |
| PATCH | `/course/updatecourseDetails/{id}` | Partially update a course (admin) |
| DELETE | `/course/deleteCourse/{id}` | Delete a course (admin) |

The course listing supports optional `search`, `category`, and `maxFee` query parameters.

### Enrollment Management

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/enrollments/{courseId}` | Enroll in a course |
| GET | `/enrollments/mine` | View the current user's enrollments |
| DELETE | `/enrollments/{courseId}` | Cancel an enrollment |

Enrollment endpoints require an authenticated user.

## Creating an Admin Account

1. Register through the application's signup page.
2. Open MySQL and find your account in the `app_users` table.
3. Update the role of your intended account:

```sql
UPDATE app_users
SET role = 'ADMIN'
WHERE id = YOUR_USER_ID;
```

Replace `YOUR_USER_ID` with the correct account ID. Log out and log in again.

Public registration creates normal `USER` accounts by default.

## Learning Outcomes

Through this project, I gained practical experience in:

- Developing REST APIs using Spring Boot.
- Building frontend components using React.js.
- Connecting a Java backend with MySQL using Spring Data JPA.
- Implementing authentication and role-based access control.
- Performing CRUD operations.
- Connecting frontend and backend applications.
- Organizing a backend using controller, service, and repository layers.

## Future Enhancements

- Add course ratings and reviews.
- Add pagination for large course lists.
- Improve automated testing.
- Add online payment integration.
- Strengthen security configuration for production deployment.


**Your Name**

Full-Stack Development Project – CourseHub
