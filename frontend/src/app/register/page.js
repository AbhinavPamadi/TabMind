"use client";
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    alert("Registered successfully!");
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account </h2>
        <p style={styles.subtitle}>Start managing your tabs smarter</p>

        <input
          style={styles.input}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={register}>
          Register
        </button>

        <p style={styles.linkText}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #1a1a2e 0%, #302b63 50%, #1a1a2e 100%)",
  },
  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 16,
    width: 420,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 5,
  },
  subtitle: {
    color: "#666",
    marginBottom: 20,
    fontSize: 18,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid #ddd",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "none",
    background: "black",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 5,
  },
  linkText: {
    marginTop: 15,
    fontSize: 18,
  },
};
