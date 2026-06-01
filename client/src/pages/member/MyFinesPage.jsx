import { useEffect, useState } from "react";
import { FiDollarSign } from "react-icons/fi";
import { fetchFines, updateFine } from "../../services/libraryService";
import DataTable from "../../components/dashboard/DataTable";
import SectionCard from "../../components/dashboard/SectionCard";
import Loader from "../../components/common/Loader";
import { useToast } from "../../contexts/ToastContext";
import { formatCurrency, formatDate } from "../../utils/helpers";
import "./MyFinesPage.css";

const MyFinesPage = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const response = await fetchFines({ mine: true });
      setFines(response.fines || []);
    } catch (error) {
      showToast(error.message || "Unable to fetch fines", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePay = async (row) => {
    try {
      await updateFine(row._id, { status: "paid" });
      showToast("Fine payment recorded");
      load();
    } catch (error) {
      showToast(error.message || "Unable to update fine", "error");
    }
  };

  if (loading) return <Loader />;

  const totalPending = fines
    .filter((f) => f.status === "pending")
    .reduce((sum, f) => sum + (f.amount || 0), 0);

  const columns = [
    { key: "reason", label: "Reason" },
    {
      key: "amount",
      label: "Amount",
      render: (value) => (
        <span className="mf-amount">{formatCurrency(value)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        const normalized = (value || "").toLowerCase();
        if (normalized === "paid") {
          return <span className="mf-badge mf-badge--success">Paid</span>;
        }
        if (normalized === "waived") {
          return <span className="mf-badge mf-badge--neutral">Waived</span>;
        }
        return <span className="mf-badge mf-badge--danger">Pending</span>;
      },
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value) => formatDate(value),
    },
  ];

  return (
    <div className="mf-page">
      <div className="mf-hero">
        <div className="mf-hero-inner">
          <span className="mf-hero-tag">Billing</span>
          <h1 className="mf-hero-title">My Fines</h1>
          <p className="mf-hero-desc">
            Track outstanding balances, view payment history, and clear your
            dues with a single click.
          </p>
        </div>

        <div className="mf-hero-summary">
          <div className="mf-hero-pill">
            <FiDollarSign />
            <span>
              Pending total: <strong>{formatCurrency(totalPending)}</strong>
            </span>
          </div>
        </div>
      </div>

      <SectionCard
        title="Fine Overview"
        subtitle="Outstanding, paid, and waived fines"
      >
        <div className="mf-table-wrapper">
          <DataTable
            columns={columns}
            rows={fines}
            actions={(row) =>
              row.status !== "paid" ? (
                <button
                  type="button"
                  className="mf-pay-btn"
                  onClick={() => handlePay(row)}
                >
                  Pay
                </button>
              ) : null
            }
          />
        </div>
      </SectionCard>
    </div>
  );
};

export default MyFinesPage;
