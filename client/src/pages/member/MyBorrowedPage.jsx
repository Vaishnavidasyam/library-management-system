import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import { fetchMyBorrowings } from "../../services/libraryService";
import DataTable from "../../components/dashboard/DataTable";
import SectionCard from "../../components/dashboard/SectionCard";
import Loader from "../../components/common/Loader";
import { useToast } from "../../contexts/ToastContext";
import { formatCurrency, formatDate } from "../../utils/helpers";
import "./MyBorrowedPage.css";

const MyBorrowedPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetchMyBorrowings();
        setRecords(response.records || []);
      } catch (error) {
        showToast(error.message || "Unable to load borrowing history", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  if (loading) return <Loader />;

  const columns = [
    {
      key: "book",
      label: "Book",
      render: (_, row) => row.book?.title,
    },
    {
      key: "issueDate",
      label: "Issued",
      render: (value) => formatDate(value),
    },
    {
      key: "dueDate",
      label: "Due",
      render: (value) => formatDate(value),
    },
    {
      key: "status",
      label: "Status",
      render: (value, row) => {
        const today = new Date();
        const due = row.dueDate ? new Date(row.dueDate) : null;
        const isOverdue =
          value === "issued" && due && due < today && !row.returnDate;

        if (value === "returned") {
          return <span className="mb-badge mb-badge--success">Returned</span>;
        }

        if (isOverdue) {
          return <span className="mb-badge mb-badge--danger">Overdue</span>;
        }

        return (
          <span className="mb-badge mb-badge--info">
            {value === "issued" ? "Issued" : value}
          </span>
        );
      },
    },
    {
      key: "fineAmount",
      label: "Fine",
      render: (value) => (
        <span
          className={
            value > 0 ? "mb-fine mb-fine--active" : "mb-fine mb-fine--none"
          }
        >
          {formatCurrency(value)}
        </span>
      ),
    },
  ];

  return (
    <div className="mb-page">
      <div className="mb-hero">
        <div className="mb-hero-inner">
          <span className="mb-hero-tag">Borrowing history</span>
          <h1 className="mb-hero-title">My Borrowed Books</h1>
          <p className="mb-hero-desc">
            Review your borrow history, track due dates, and stay on top of any
            fines in a clear timeline.
          </p>
        </div>
        <div className="mb-hero-pill">
          <FiClock />
          <span>Showing your latest activity</span>
        </div>
      </div>

      <SectionCard
        title="Borrow History"
        subtitle="All your past and current loans at a glance"
      >
        <div className="mb-table-wrapper">
          <DataTable columns={columns} rows={records} />
        </div>
      </SectionCard>
    </div>
  );
};

export default MyBorrowedPage;
