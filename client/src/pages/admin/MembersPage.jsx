import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiUserPlus,
  FiUsers,
  FiRefreshCw,
} from "react-icons/fi";
import {
  createMember,
  deleteMember,
  fetchMembers,
  updateMember,
} from "../../services/libraryService";
import { formatDate } from "../../utils/helpers";
import SectionCard from "../../components/dashboard/SectionCard";
import DataTable from "../../components/dashboard/DataTable";
import Loader from "../../components/common/Loader";
import { useToast } from "../../contexts/ToastContext";
import "./MembersPage.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
  membershipId: "",
  address: "",
  joinDate: "",
};

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await fetchMembers();
      setMembers(response.members || []);
    } catch (error) {
      showToast(error.message || "Unable to fetch members", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId("");
    setForm(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await updateMember(editingId, form);
        showToast("Member updated");
      } else {
        await createMember(form);
        showToast("Member added");
      }
      resetForm();
      loadMembers();
    } catch (error) {
      showToast(error.message || "Unable to save member", "error");
    }
  };

  const onEdit = (row) => {
    setEditingId(row._id);
    setForm({
      name: row.name || "",
      email: row.email || "",
      phone: row.phone || "",
      department: row.department || "",
      membershipId: row.membershipId || "",
      address: row.address || "",
      joinDate: row.joinDate?.slice(0, 10) || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete member?")) return;
    try {
      await deleteMember(id);
      showToast("Member deleted");
      loadMembers();
    } catch (error) {
      showToast(error.message || "Unable to delete member", "error");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "membershipId", label: "Membership ID" },
    { key: "createdAt", label: "Joined", render: (value) => formatDate(value) },
  ];

  return loading ? (
    <Loader />
  ) : (
    <div className="mp-page">
      {/* ── Hero ── */}
      <div className="mp-hero">
        <div className="mp-hero-inner">
          <span className="mp-hero-tag">Member Management</span>
          <h1 className="mp-hero-title">Members</h1>
          <p className="mp-hero-desc">
            Create, edit, and maintain member records in one clean workspace.
          </p>
        </div>
        <div className="mp-hero-stat">
          <span className="mp-hero-stat-num">{members.length}</span>
          <span className="mp-hero-stat-label">Total Members</span>
        </div>
      </div>

      {/* ── Top grid: form + summary ── */}
      <div className="mp-top-grid">
        {/* Form card */}
        <div className="mp-card">
          <div className="mp-card-header">
            <div className="mp-card-title-row">
              <span className="mp-card-icon">
                <FiUserPlus />
              </span>
              <div>
                <h2 className="mp-card-title">
                  {editingId ? "Edit Member" : "Add New Member"}
                </h2>
                <p className="mp-card-subtitle">
                  Create or update member identity and contact info
                </p>
              </div>
            </div>
            {editingId && <span className="mp-editing-badge">Editing</span>}
          </div>

          <form className="mp-form" onSubmit={handleSubmit}>
            <div className="mp-section-label">Personal Info</div>
            <div className="mp-grid mp-grid-2">
              <div className="mp-field">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Ravi Kumar"
                />
              </div>
              <div className="mp-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="ravi@example.com"
                />
              </div>
              <div className="mp-field">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="text"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="mp-field">
                <label htmlFor="department">Department</label>
                <input
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Engineering"
                />
              </div>
            </div>

            <div className="mp-section-label">Membership Details</div>
            <div className="mp-grid mp-grid-2">
              <div className="mp-field">
                <label htmlFor="membershipId">Membership ID</label>
                <input
                  id="membershipId"
                  name="membershipId"
                  value={form.membershipId}
                  onChange={handleChange}
                  type="text"
                  placeholder="MEM-0001"
                />
              </div>
              <div className="mp-field">
                <label htmlFor="joinDate">Join Date</label>
                <input
                  id="joinDate"
                  name="joinDate"
                  value={form.joinDate}
                  onChange={handleChange}
                  type="date"
                />
              </div>
            </div>

            <div className="mp-grid mp-grid-1">
              <div className="mp-field">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Street, City, State, PIN…"
                />
              </div>
            </div>

            <div className="mp-actions">
              <button
                className="mp-btn-ghost"
                type="button"
                onClick={resetForm}
              >
                <FiRefreshCw /> Reset
              </button>
              <button className="mp-btn-primary" type="submit">
                <FiUserPlus />
                {editingId ? "Update Member" : "Add Member"}
              </button>
            </div>
          </form>
        </div>

        {/* Summary card */}
        <div className="mp-card mp-summary-card">
          <div className="mp-card-header">
            <div className="mp-card-title-row">
              <span className="mp-card-icon mp-card-icon--teal">
                <FiUsers />
              </span>
              <div>
                <h2 className="mp-card-title">Quick Summary</h2>
                <p className="mp-card-subtitle">
                  Live snapshot of member activity
                </p>
              </div>
            </div>
          </div>

          <div className="mp-summary-list">
            <div className="mp-summary-item">
              <div className="mp-summary-icon mp-si--indigo">
                <FiUsers />
              </div>
              <div className="mp-summary-body">
                <span className="mp-summary-label">Total Members</span>
                <strong className="mp-summary-value">{members.length}</strong>
              </div>
            </div>

            <div className="mp-summary-item">
              <div className="mp-summary-icon mp-si--amber">
                <FiEdit2 />
              </div>
              <div className="mp-summary-body">
                <span className="mp-summary-label">Form Mode</span>
                <strong className="mp-summary-value">
                  {editingId ? "Editing" : "Creating"}
                </strong>
              </div>
            </div>

            <div className="mp-summary-item">
              <div className="mp-summary-icon mp-si--teal">
                <FiUserPlus />
              </div>
              <div className="mp-summary-body">
                <span className="mp-summary-label">Latest Member</span>
                <strong className="mp-summary-value mp-summary-value--trunc">
                  {members[0]?.name || "—"}
                </strong>
              </div>
            </div>

            <div className="mp-summary-item">
              <div className="mp-summary-icon mp-si--green">
                <FiUsers />
              </div>
              <div className="mp-summary-body">
                <span className="mp-summary-label">Last Joined</span>
                <strong className="mp-summary-value">
                  {members[0]?.createdAt
                    ? formatDate(members[0].createdAt)
                    : "—"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Directory table ── */}
      <div className="mp-card">
        <div className="mp-card-header">
          <div className="mp-card-title-row">
            <span className="mp-card-icon mp-card-icon--coral">
              <FiUsers />
            </span>
            <div>
              <h2 className="mp-card-title">Members Directory</h2>
              <p className="mp-card-subtitle">
                View profiles, borrowing history, and contact records
              </p>
            </div>
          </div>
          <span className="mp-count-badge">{members.length} members</span>
        </div>

        <DataTable
          columns={columns}
          rows={members}
          actions={(row) => (
            <div className="mp-row-actions">
              <button
                type="button"
                className="mp-icon-btn"
                title="Edit member"
                onClick={() => onEdit(row)}
              >
                <FiEdit2 />
              </button>
              <button
                type="button"
                className="mp-icon-btn mp-icon-btn--danger"
                title="Delete member"
                onClick={() => onDelete(row._id)}
              >
                <FiTrash2 />
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default MembersPage;
