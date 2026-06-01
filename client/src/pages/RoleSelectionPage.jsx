import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { FiShield, FiUser, FiArrowRight, FiCheckCircle } from "react-icons/fi";

import Navbar from "../components/Navbar";
import "./RoleSelectionPage.css";

const roles = [
  {
    key: "admin",
    title: "Administrator",
    label: "ADMIN PORTAL",
    icon: <FiShield />,
    description:
      "Manage books, members, inventory, reports, fines, analytics and system settings.",
    features: [
      "Book Management",
      "Member Management",
      "Reports & Analytics",
      "Inventory Control",
    ],
  },
  {
    key: "member",
    title: "Library Member",
    label: "MEMBER PORTAL",
    icon: <FiUser />,
    description:
      "Browse books, reserve titles, track borrowing history and manage your profile.",
    features: [
      "Search Books",
      "Reserve Books",
      "Borrowing History",
      "Profile Management",
    ],
  },
];

const RoleSelectionPage = () => {
  return (
    <>
      <Navbar />

      <div className="role-page">
        <div className="bg-glow glow-1"></div>
        <div className="bg-glow glow-2"></div>
        <motion.div
          className="role-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="role-badge">Choose Your Workspace</span>

          <h1>
            Select Your <span>Role</span>
          </h1>

          <p>
            Continue with the workspace that best matches your responsibilities
            and access level.
          </p>
        </motion.div>
        <div className="role-grid">
          {roles.map((role, index) => (
            <motion.div
              key={role.key}
              className="role-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="card-glow"></div>

              <div className="role-top">
                <div className="role-icon">{role.icon}</div>

                <span className="role-label">
                  {role.key === "admin" ? "ADMIN PORTAL" : "MEMBER PORTAL"}
                </span>
              </div>

              <h2>{role.title}</h2>

              <p className="role-description">{role.description}</p>

              <div className="feature-list">
                {role.features.map((item) => (
                  <div key={item} className="feature-item">
                    <FiCheckCircle />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="role-actions">
                <Link to={`/login/${role.key}`} className="outline-btn">
                  Login
                </Link>

                <Link to={`/register/${role.key}`} className="gradient-btn">
                  Register
                  <FiArrowRight />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>{" "}
      </div>
    </>
  );
};

export default RoleSelectionPage;
