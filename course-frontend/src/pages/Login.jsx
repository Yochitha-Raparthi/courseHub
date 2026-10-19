
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const AUTH_URL = 'http://localhost:9878/auth';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed. Check your details.');
      }

      // Confirm the authenticated user and role using the backend.
      const meResponse = await fetch(`${AUTH_URL}/me`, {
        credentials: 'include',
      });

      if (!meResponse.ok) {
        throw new Error('Login succeeded, but the user session could not be verified.');
      }

      const user = await meResponse.json();
      onLogin(user);

      const role = String(user.role || '').toUpperCase();
      navigate(
        role === 'ADMIN' || role === 'ROLE_ADMIN'
          ? '/admin-dashboard'
          : '/user-dashboard',
        { replace: true }
      );
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  
return (
  <main className="login-page">
    <form className="login-card" onSubmit={handleSubmit}>
      <h1>Welcome to CourseHub</h1>
      <p className="login-subtitle">
        Sign in to continue learning.
      </p>

      {error && (
        <p className="login-message" role="alert">
          {error}
        </p>
      )}

      <label htmlFor="login-email">Email Address</label>
      <input
        id="login-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        autoComplete="email"
        required
      />

      <label htmlFor="login-password">Password</label>
      <input
        id="login-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        autoComplete="current-password"
        required
      />

      <button
        type="submit"
        className="login-submit"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="login-footer">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>

      <Link to="/" className="login-home-link">
        Back to Home
      </Link>
    </form>
  </main>
);

}
