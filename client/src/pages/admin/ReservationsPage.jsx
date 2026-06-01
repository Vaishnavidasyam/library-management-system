import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiUsers,
  FiBook,
  FiCheck,
  FiX,
  FiClock,
} from "react-icons/fi";
import {
  fetchReservations,
  updateReservation,
} from "../../services/libraryService";
import { formatDate } from "../../utils/helpers";
import DataTable from "../../components/dashboard/DataTable";
import Loader from "../../components/common/Loader";
import { useToast } from "../../contexts/ToastContext";
import "./ReservationsPage.css";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const response = await fetchReservations();
      setReservations(response.reservations || []);
    } catch (error) {
      showToast(error.message || "Unable to fetch reservations", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await updateReservation(id, { status });
      showToast(`Reservation ${status}`);
      load();
    } catch (error) {
      showToast(error.message || "Unable to update reservation", "error");
    }
  };

  const columns = [
    { key: "member", label: "Member", render: (_, row) => row.member?.name },
    { key: "book", label: "Book", render: (_, row) => row.book?.title },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className={`res-status-badge res-status--${value}`}>{value}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Requested",
      render: (value) => formatDate(value),
    },
  ];

  const total = reservations.length;
  const pending = reservations.filter((r) => r.status === "pending").length;
  const approved = reservations.filter((r) => r.status === "approved").length;
  const rejected = reservations.filter((r) => r.status === "rejected").length;

  return loading ? (
    <Loader />
  ) : (
    <div className="res-page">
      {/* ── Hero ── */}
      <div className="res-hero">
        <div className="res-hero-inner">
          <span className="res-hero-tag">Reservation Management</span>
          <h1 className="res-hero-title">Reservations</h1>
          <p className="res-hero-desc">
            Review member requests, approve or reject reservations, and keep
            your hold queue under control with a clear, real-time overview.
          </p>
        </div>
        <div className="res-hero-stats">
          <div className="res-hero-stat">
            <span className="res-hero-stat-label">Total</span>
            <span className="res-hero-stat-num">{total}</span>
          </div>
          <div className="res-hero-stat-divider" />
          <div className="res-hero-stat">
            <span className="res-hero-stat-label">Pending</span>
            <span className="res-hero-stat-num">{pending}</span>
          </div>
          <div className="res-hero-stat-divider" />
          <div className="res-hero-stat">
            <span className="res-hero-stat-label">Approved</span>
            <span className="res-hero-stat-num">{approved}</span>
          </div>
          <div className="res-hero-stat-divider" />
          <div className="res-hero-stat res-hero-stat--alert">
            <span className="res-hero-stat-label">Rejected</span>
            <span className="res-hero-stat-num">{rejected}</span>
          </div>
        </div>
      </div>

      {/* ── Main card ── */}
      <div className="res-card">
        <div className="res-card-header">
          <div className="res-card-title-row">
            <span className="res-card-icon res-ci--indigo">
              <FiCalendar />
            </span>
            <div>
              <h2 className="res-card-title">Reservation Queue</h2>
              <p className="res-card-subtitle">
                Approve, reject, or cancel member requests before they become
                active borrows.
              </p>
            </div>
          </div>
          <span className="res-count-badge">{total} reservations</span>
        </div>

        <DataTable
          columns={columns}
          rows={reservations}
          actions={(row) => (
            <div className="res-row-actions">
              <button
                className="res-icon-button"
                title="Approve reservation"
                onClick={() => updateStatus(row._id, "approved")}
              >
                <FiCheck />
              </button>
              <button
                className="res-icon-button res-icon-button--danger"
                title="Reject reservation"
                onClick={() => updateStatus(row._id, "rejected")}
              >
                <FiX />
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default ReservationsPage;
