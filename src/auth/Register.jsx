import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "./AuthContext";
import "./auth.css";

/** A form that allows users to register for a new account */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const onRegister = async (formData) => {
    const username = formData.get("username");
    const password = formData.get("password");
    const first_name = formData.get("first_name");
    const last_name = formData.get("last_name");
    const email = formData.get("email");
    try {
      await register({ username, password, first_name, last_name, email });
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Register</h1>
        <hr className="auth-divider" />
        <form className="auth-form" action={onRegister}>
          <label className="visually-hidden" htmlFor="register-username">
            Username
          </label>
          <input
            id="register-username"
            type="text"
            name="username"
            placeholder="username"
            required
          />
          <label className="visually-hidden" htmlFor="register-first-name">
            First name
          </label>
          <input
            id="register-first-name"
            type="text"
            name="first_name"
            placeholder="first name"
            required
          />
          <label className="visually-hidden" htmlFor="register-last-name">
            Last name
          </label>
          <input
            id="register-last-name"
            type="text"
            name="last_name"
            placeholder="last name"
            required
          />
          <label className="visually-hidden" htmlFor="register-email">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            name="email"
            placeholder="email"
            required
          />
          <label className="visually-hidden" htmlFor="register-password">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            name="password"
            placeholder="password"
            required
          />
          <button type="submit">Register</button>
          {error && <output className="auth-error">{error}</output>}
        </form>
        <hr className="auth-divider auth-divider-bottom" />
        <Link className="auth-switch-link" to="/login">
          Already have an account? Log in here.
        </Link>
      </div>
    </section>
  );
}
