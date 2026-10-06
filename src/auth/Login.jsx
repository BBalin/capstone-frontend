import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";

import { useAuth } from "./AuthContext";
import "./auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState(null);

  const onLogin = async (formData) => {
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      await login({ username, password });
      navigate(location.state?.from?.pathname ?? "/");
    } catch (e) {
      setError(e.message);
    }
  };
  /** A form that allows users to log into an existing account. */
  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        <hr className="auth-divider" />
        <form className="auth-form" action={onLogin}>
          <label className="visually-hidden" htmlFor="login-username">
            Username
          </label>
          <input
            id="login-username"
            type="text"
            name="username"
            placeholder="username"
            required
          />
          <label className="visually-hidden" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            name="password"
            placeholder="password"
            required
          />
          <button type="submit">Login</button>
          {error && <output className="auth-error">{error}</output>}
        </form>
        <hr className="auth-divider auth-divider-bottom" />
        <Link
          className="auth-switch-link"
          to="/register"
          state={location.state}
        >
          Need an account? Register here.
        </Link>
      </div>
    </section>
  );
}
