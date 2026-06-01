import React from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiUsers,
  FiBarChart2,
  FiShield,
  FiAward,
  FiClock,
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import "./Home.css";

const HomePage = () => {
  return (
    <>
      <Navbar />

      <div className="homepage">
        {/* Hero Section */}

        <section className="hero">
          <div className="hero-content">
            <span className="hero-badge">
              🚀 Smart Digital Library Platform
            </span>

            <h1>
              Modern Library
              <span> Management System</span>
            </h1>

            <p>
              Manage books, members, circulation, analytics, reports, fines and
              digital resources through one intelligent, secure and premium
              dashboard.
            </p>

            <div className="hero-buttons">
              <Link to="/select-role" className="primary-btn">
                Get Started
                <FiArrowRight />
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <h3>12.5K+</h3>
                <span>Books</span>
              </div>

              <div>
                <h3>4.8K+</h3>
                <span>Members</span>
              </div>

              <div>
                <h3>98%</h3>
                <span>Satisfaction</span>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200"
              alt="Library"
            />

            <div className="floating-card card1">📚 12,500 Books</div>

            <div className="floating-card card2">👥 4,800 Members</div>

            <div className="floating-card card3">📈 +18% Growth</div>
          </div>
        </section>

        {/* Features */}

        <section className="features" id="features">
          <div className="section-title">
            <h2>Powerful Features</h2>
            <p>Everything required to run a modern digital library.</p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <FiBookOpen />
              <h3>Book Management</h3>
              <p>Add, update, categorize, search and manage books.</p>
            </div>

            <div className="feature-card">
              <FiUsers />
              <h3>Member Management</h3>
              <p>Manage memberships, profiles and borrowing history.</p>
            </div>

            <div className="feature-card">
              <FiBarChart2 />
              <h3>Analytics</h3>
              <p>Visual reports and real-time performance insights.</p>
            </div>

            <div className="feature-card">
              <FiShield />
              <h3>Secure Access</h3>
              <p>JWT authentication and role-based permissions.</p>
            </div>
          </div>
        </section>

        {/* Benefits */}

        <section className="benefits">
          <div className="section-title">
            <h2>Why Choose Velora?</h2>
          </div>

          <div className="benefit-grid">
            <div className="benefit-card">
              <FiAward />
              <h3>Premium Experience</h3>
              <p>Modern UI designed with enterprise-level standards.</p>
            </div>

            <div className="benefit-card">
              <FiClock />
              <h3>Time Saving</h3>
              <p>Reduce manual work through automation and smart workflows.</p>
            </div>

            <div className="benefit-card">
              <FiShield />
              <h3>Reliable Security</h3>
              <p>Secure authentication and protected library operations.</p>
            </div>
          </div>
        </section>

        {/* Footer */}

        <footer className="footer">
          <h3>Velora Library OS</h3>

          <p>
            Modern library operations for schools, colleges and institutions.
          </p>

          <span>© 2026 Velora Library OS</span>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
