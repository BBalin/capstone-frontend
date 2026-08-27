import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import "./profile.css";

const BASE = import.meta.env.VITE_API;

function Profile() {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function loadUser() {
      setStatus("loading");
      try {
        const response = await fetch(`${BASE}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const result = await response.json();
        setUser(result);
        setStatus("ready");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load profile:", error);
          setStatus("error");
        }
      }
    }
    loadUser();
    return () => controller.abort();
  }, [token]);

  if (status === "loading") {
    return <p className="status-message">Loading your profile...</p>;
  }

  if (status === "error") {
    return (
      <p className="status-message status-error">
        {" "}
        Sorry, we cannot load your profile now.
      </p>
    );
  }

  return (
    <section className="profile-page">
      <h1>Welcome, {user.first_name}</h1>

      <div className="profile-info">
        <p>First Name: {user.first_name}</p>
        <p>Last Name: {user.last_name}</p>
        <p>Email: {user.email}</p>
      </div>

      <div className="orders-box">
        <p className="orders-title">Your Orders</p>
        <div className="orders-grid">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="order-placeholder" key={index}></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Profile;
