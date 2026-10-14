
import { useState } from "react";

const API = "http://localhost:9878/auth";

export default function Auth({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const endpoint = isSignup ? "/signup" : "/login";

      const body = isSignup
        ? { name, email, password }
        : { email, password };

      const response = await fetch(API + endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          Object.values(data).join(", ") ||
          "Request failed"
        );
      }

      if (isSignup) {
        setMessage("Signup successful! Please log in.");
        setIsSignup(false);
        setPassword("");
      } else {
        onLogin(data);
      }
    } catch (error) {
      setMessage(error.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>Course Portal</h2>
        <p>{isSignup ? "Create your account" : "Welcome back"}</p>

        {isSignup && (
          <input
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            maxLength={100}
          />
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          maxLength={150}
        />

        <input
          type="password"
          placeholder="Password (minimum 8 characters)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={isSignup ? 8 : 1}
          maxLength={72}
        />

        {message && <p role="alert">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isSignup
              ? "Sign Up"
              : "Login"}
        </button>

        <p>
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}
          {" "}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setMessage("");
            }}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
    padding: "20px"
  },
  card: {
    width: "100%",
    maxWidth: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    padding: "30px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px #00000012"
  }
};