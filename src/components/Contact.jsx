import { useState } from "react";

import { useAuth } from "../auth/AuthContext";
import "./contact.css";

const BASE = import.meta.env.VITE_API;

function Contact() {
  const { token } = useAuth();

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const response = await fetch(`${BASE}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
      const result = await response.text();
      if (!response.ok) throw new Error(result);

      setStatus("sent");
      setMessage("");
    } catch (e) {
      setError(e.message);
      setStatus("error");
    }
  };

  return (
    <section className="contact-page">
      <h1>Contact Us</h1>
      <form className="contact-form" onSubmit={onSubmit}>
        <label className="visually-hidden" htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Type your message here..."
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            setStatus("idle");
          }}
          required
        />
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Submit"}
        </button>
      </form>

      {status === "sent" && (
        <p className="status-message contact-success">Message sent!</p>
      )}
      {status === "error" && (
        <p className="status-message status-error">{error}</p>
      )}
    </section>
  );
}

export default Contact;
