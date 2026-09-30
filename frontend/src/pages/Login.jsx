import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/client";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleLogin(event) {

    event.preventDefault();

    setLoading(true);
    setError("");

    try {

      await api.post(
        "/auth/login",
        {
          username,
          password
        }
      );

      navigate("/dashboard");

    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-content">
          <a className="login-brand" href="/login" aria-label="PWA home">
            <span className="brand-mark" aria-hidden="true">P</span>
            <span>PWA</span>
          </a>

          <div className="login-intro">
            <p className="login-eyebrow">YOUR WORKSPACE, IN FOCUS</p>
            <h1>Good to have<br />you back.</h1>
            <p className="login-subtitle">
              Sign in to pick up where your best work happens.
            </p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {error && (
              <p className="login-error" role="alert">{error}</p>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <span aria-hidden="true">&#8594;</span>}
            </button>
          </form>

          <p className="login-footnote">
            Need access? Ask your workspace administrator.
          </p>
        </div>
      </section>

    </main>
  );
}

export default Login;