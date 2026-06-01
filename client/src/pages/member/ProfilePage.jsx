import { useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import SectionCard from "../../components/dashboard/SectionCard";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "",
    address: user?.address || "",
  });

  const handleChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    // hook up to an API later
    // updateProfile(profile)
    //   .then(() => showToast('Profile updated'))
    //   .catch(...)
    console.log("Profile to save: ", profile);
  };

  return (
    <div className="prof-page">
      <div className="prof-hero">
        <div className="prof-avatar">
          <span>{(profile.name || user?.name || "U").charAt(0)}</span>
        </div>
        <div className="prof-hero-text">
          <h1>{profile.name || "Your profile"}</h1>
          <p>
            Manage your account details, contact information, and department
            preferences.
          </p>
        </div>
      </div>

      <SectionCard
        title="Profile"
        subtitle="Update your personal information and keep it up to date"
      >
        <form
          className="prof-form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="prof-field">
            <label htmlFor="name">
              <FiUser />
              <span>Name</span>
            </label>
            <input
              id="name"
              type="text"
              value={profile.name}
              onChange={handleChange("name")}
              placeholder="Enter your full name"
            />
          </div>

          <div className="prof-field">
            <label htmlFor="email">
              <FiMail />
              <span>Email</span>
            </label>
            <input
              id="email"
              type="email"
              value={profile.email}
              onChange={handleChange("email")}
              placeholder="Enter your email"
            />
          </div>

          <div className="prof-field">
            <label htmlFor="phone">
              <FiPhone />
              <span>Phone</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={profile.phone}
              onChange={handleChange("phone")}
              placeholder="Add a contact number"
            />
          </div>

          <div className="prof-field">
            <label htmlFor="department">
              <FiBriefcase />
              <span>Department</span>
            </label>
            <input
              id="department"
              type="text"
              value={profile.department}
              onChange={handleChange("department")}
              placeholder="e.g. Computer Science"
            />
          </div>

          <div className="prof-field prof-field--full">
            <label htmlFor="address">
              <FiMapPin />
              <span>Address</span>
            </label>
            <textarea
              id="address"
              rows={3}
              value={profile.address}
              onChange={handleChange("address")}
              placeholder="Enter your address"
            />
          </div>

          <div className="prof-actions">
            <button type="submit" className="prof-save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
};

export default ProfilePage;
