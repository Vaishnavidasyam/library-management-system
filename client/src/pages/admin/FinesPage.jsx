import { useEffect, useState } from "react";
import { FiDollarSign, FiShield, FiAlertTriangle } from "react-icons/fi";
import { fetchFines, updateFine } from "../../services/libraryService";
import { formatCurrency, formatDate } from "../../utils/helpers";
import DataTable from "../../components/dashboard/DataTable";
import Loader from "../../components/common/Loader";
import { useToast } from "../../contexts/ToastContext";
import "./FinesPage.css";

const FinesPage = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const response = await fetchFines();
      setFines(response.fines || []);
    } catch (error) {
      showToast(error.message || "Unable to fetch fines", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpdateFine = async (id, status, message) => {
    try {
      await updateFine(id, { status });
      showToast(message);
      load();
    } catch (error) {
      showToast(error.message || "Unable to update fine", "error");
    }
  };

  const columns = [
    {
      key: "member",
      label: "Member",
      render: (_, row) => row.member?.name,
    },
    {
      key: "amount",
      label: "Amount",
      render: (value) => (
        <span className="fine-amount-chip">{formatCurrency(value)}</span>
      ),
    },
    { key: "reason", label: "Reason" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className={`fine-status-badge fine-status--${value}`}>
          {value}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value) => formatDate(value),
    },
  ];

  // Derived stats
  const totalFines = fines.length;
  const totalAmount = fines.reduce((sum, f) => sum + (f.amount || 0), 0);
  const pending = fines.filter((f) => f.status === "pending");
  const pendingCount = pending.length;
  const pendingAmount = pending.reduce((sum, f) => sum + (f.amount || 0), 0);
  const paidCount = fines.filter((f) => f.status === "paid").length;
  const waivedCount = fines.filter((f) => f.status === "waived").length;

  return loading ? (
    <Loader />
  ) : (
    <div className="fine-page">
      {/* ── Hero ── */}
      <div className="fine-hero">
        <div className="fine-hero-inner">
          <span className="fine-hero-tag">Fine Management</span>
          <h1 className="fine-hero-title">Fines & Payments</h1>
          <p className="fine-hero-desc">
            Track outstanding balances, mark fines as paid or waived, and keep
            your library&apos;s revenue and policies transparent.
          </p>
        </div>

        <div className="fine-hero-stats">
          <div className="fine-hero-stat">
            <span className="fine-hero-stat-label">Total Fines</span>
            <span className="fine-hero-stat-num">{totalFines}</span>
          </div>
          <div className="fine-hero-stat-divider" />
          <div className="fine-hero-stat">
            <span className="fine-hero-stat-label">Pending</span>
            <span className="fine-hero-stat-num">{pendingCount}</span>
          </div>
          <div className="fine-hero-stat-divider" />
          <div className="fine-hero-stat">
            <span className="fine-hero-stat-label">Total Amount</span>
            <span className="fine-hero-stat-num">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main card ── */}
      <div className="fine-card">
        <div className="fine-card-header">
          <div className="fine-card-title-row">
            <span className="fine-card-icon fine-ci--coral">
              <FiAlertTriangle />
            </span>
            <div>
              <h2 className="fine-card-title">Fine Overview</h2>
              <p className="fine-card-subtitle">
                Collect payments, waive balances, and view detailed fine history
                for every member.
              </p>
            </div>
          </div>
          <div className="fine-card-meta">
            <span className="fine-count-badge">
              {pendingCount} pending · {paidCount} paid · {waivedCount} waived
            </span>
            <span className="fine-count-badge fine-count-badge--soft">
              Pending amount: {formatCurrency(pendingAmount)}
            </span>
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={fines}
          actions={(row) => (
            <div className="fine-row-actions">
              <button
                className="fine-icon-button"
                title="Mark as paid"
                onClick={() =>
                  handleUpdateFine(row._id, "paid", "Fine marked as paid")
                }
              >
                <FiDollarSign />
              </button>
              <button
                className="fine-icon-button fine-icon-button--secondary"
                title="Waive fine"
                onClick={() =>
                  handleUpdateFine(row._id, "waived", "Fine waived")
                }
              >
                <FiShield />
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default FinesPage;
