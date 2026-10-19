
import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing-page">
      <header className="landing-navbar">
        <Link to="/" className="landing-logo">
          CourseHub
        </Link>

        <nav className="landing-nav-links">
          <Link to="/login" className="landing-login-link">
            Login
          </Link>

          <Link to="/signup" className="landing-signup-link">
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <p className="landing-eyebrow">
            YOUR LEARNING JOURNEY STARTS HERE
          </p>

          <h1>
            Learn New Skills.
            <br />
            Build Your Future.
          </h1>

          <p className="landing-description">
            Discover courses, learn from trainers, and manage your
            learning journey with CourseHub.
          </p>

          <div className="landing-actions">
            <Link to="/signup" className="landing-primary-button">
              Get Started
            </Link>

            <Link to="/login" className="landing-secondary-button">
              Login
            </Link>
          </div>
        </section>

        <section className="landing-features">
          <article className="landing-feature-card">
            <span>01</span>
            <h2>Explore Courses</h2>
            <p>Discover courses and learn new skills.</p>
          </article>

          <article className="landing-feature-card">
            <span>02</span>
            <h2>Easy Enrollment</h2>
            <p>Enroll in courses and manage your learning.</p>
          </article>

          <article className="landing-feature-card">
            <span>03</span>
            <h2>Manage Courses</h2>
            <p>Keep course information organized in one place.</p>
          </article>
        </section>

        <footer className="landing-footer">
          © {new Date().getFullYear()} CourseHub. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
