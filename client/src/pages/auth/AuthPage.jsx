import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiBookOpen, FiUsers, FiBarChart2 } from "react-icons/fi";

import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import Navbar from "../../components/Navbar";

import "./AuthPage.css";

const baseState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  department: "",
  address: "",
};

const AuthPage = ({ mode }) => {
  const { role = "member" } = useParams();

  const isRegister = mode === "register";

  const [form, setForm] = useState(baseState);

  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();

  const { showToast } = useToast();

  const navigate = useNavigate();

  const title = useMemo(
    () => (isRegister ? "Create Your Account" : "Welcome Back"),
    [isRegister],
  );

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const payload = isRegister
        ? { ...form, role }
        : {
            email: form.email,
            password: form.password,
            role,
          };

      const response = isRegister
        ? await register(payload)
        : await login(payload);

      showToast(response.message);

      navigate(`/${response.user.role}`);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-page">
        <div className="auth-left">
          <div className="overlay"></div>

          <div className="left-content">
            <span className="hero-badge">Velora Library OS</span>

            <h1>Smart Library Management Platform</h1>

            <p>
              Manage books, members, borrowing, reports and analytics through
              one intelligent workspace.
            </p>

            <div className="feature-cards">
              <div className="mini-card">
                <FiBookOpen />
                <div>
                  <h3>12.5K+</h3>
                  <span>Books</span>
                </div>
              </div>

              <div className="mini-card">
                <FiUsers />
                <div>
                  <h3>4.8K+</h3>
                  <span>Members</span>
                </div>
              </div>

              <div className="mini-card">
                <FiBarChart2 />
                <div>
                  <h3>98%</h3>
                  <span>Satisfaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.form
          className="auth-card"
          onSubmit={handleSubmit}
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <span className="role-badge">{role.toUpperCase()} PORTAL</span>

          <h2>{title}</h2>

          <p className="subtitle">Secure access to your library workspace.</p>

          {isRegister && (
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {isRegister && (
            <>
              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
              />

              <input
                name="department"
                placeholder="Department"
                value={form.department}
                onChange={handleChange}
              />

              <textarea
                name="address"
                rows="3"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
              />
            </>
          )}

          <button className="auth-btn" disabled={submitting}>
            {submitting
              ? "Please Wait..."
              : isRegister
                ? "Create Account"
                : "Login"}
          </button>

          <p className="switch-copy">
            {isRegister ? "Already have an account?" : "Need an account?"}

            <Link to={`/${isRegister ? "login" : "register"}/${role}`}>
              {isRegister ? " Login" : " Register"}
            </Link>
          </p>
        </motion.form>
      </div>
    </>
  );
};

export default AuthPage;
