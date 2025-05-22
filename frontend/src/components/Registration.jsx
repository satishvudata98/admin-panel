import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import "./Registration.css";
function Registration() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState({});
  const { setUser } = useContext(UserContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setError({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setUser(res.data.user);
      setMessage(`User ${res.data.user.name} registered successfully!`);
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(`Registration failed: ${err.response.data.message}`);
      } else {
        setMessage("Registration failed. Email may already exist.");
      }
    }
  };

return (
    <div className="container">
        <h2>User Registration</h2>
        <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    className="form-control"
                    name="name"
                    value={form.name}
                    placeholder="Name"
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    className="form-control"
                    name="email"
                    type="email"
                    value={form.email}
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    className="form-control"
                    name="password"
                    type="password"
                    value={form.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    id="confirmPassword"
                    className="form-control"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    required
                />
                {error.confirmPassword && (
                    <div className="error">{error.confirmPassword}</div>
                )}
            </div>
            <button type="submit" className="btn">
                Register
            </button>
        </form>
        <p className="message">{message}</p>
    </div>
);
}

export default Registration;
