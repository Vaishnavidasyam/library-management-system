import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiPlusCircle,
  FiBook,
  FiUsers,
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import SectionCard from "../../components/dashboard/SectionCard";
import DataTable from "../../components/dashboard/DataTable";
import Loader from "../../components/common/Loader";
import {
  fetchBooks,
  fetchBorrowRecords,
  fetchMembers,
  issueBook,
  returnBook,
} from "../../services/libraryService";
import { formatCurrency, formatDate } from "../../utils/helpers";
import { useToast } from "../../contexts/ToastContext";
import "./BorrowingPage.css";

const BorrowingPage = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [issueForm, setIssueForm] = useState({
    memberId: "",
    bookId: "",
    issueDate: "",
    dueDate: "",
  });
  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [borrowResponse, bookResponse, memberResponse] = await Promise.all([
        fetchBorrowRecords(),
        fetchBooks(),
        fetchMembers(),
      ]);
      setRecords(borrowResponse.records || []);
      setBooks(bookResponse.books || []);
      setMembers(memberResponse.members || []);
    } catch (error) {
      showToast(error.message || "Unable to load borrowing data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIssue = async (event) => {
    event.preventDefault();
    try {
      await issueBook(issueForm);
      showToast("Book issued successfully");
      setIssueForm({ memberId: "", bookId: "", issueDate: "", dueDate: "" });
      loadData();
    } catch (error) {
      showToast(error.message || "Unable to issue book", "error");
    }
  };

  const handleReturn = async (id) => {
    try {
      await returnBook(id, { returnDate: new Date().toISOString() });
      showToast("Book returned successfully");
      loadData();
    } catch (error) {
      showToast(error.message || "Unable to return book", "error");
    }
  };

  const resetForm = () =>
    setIssueForm({ memberId: "", bookId: "", issueDate: "", dueDate: "" });

  // Derived stats
  const totalIssued = records.filter((r) => r.status === "issued").length;
  const totalReturned = records.filter((r) => r.status === "returned").length;
  const overdue = records.filter(
    (r) => r.status === "issued" && new Date(r.dueDate) < new Date(),
  ).length;

  const columns = [
    { key: "member", label: "Member", render: (_, row) => row.member?.name },
    {
      key: "book",
      label: "Book",
      render: (_, row) => row.book?.title || "Deleted Book",
    },
    { key: "issueDate", label: "Issued", render: (value) => formatDate(value) },
    { key: "dueDate", label: "Due", render: (value) => formatDate(value) },
    {
      key: "fineAmount",
      label: "Fine",
      render: (value) => formatCurrency(value),
    },
    { key: "status", label: "Status" },
  ];

  return loading ? (
    <Loader />
  ) : (
    <div className="brw-page">
      {/* ── Hero ── */}
      <div className="brw-hero">
        <div className="brw-hero-inner">
          <span className="brw-hero-tag">Borrowing Management</span>
          <h1 className="brw-hero-title">Borrowing</h1>
          <p className="brw-hero-desc">
            Issue books, track due dates, manage returns, and monitor overdue
            fines in one place.
          </p>
        </div>
        <div className="brw-hero-stats">
          <div className="brw-hero-stat">
            <span className="brw-hero-stat-num">{totalIssued}</span>
            <span className="brw-hero-stat-label">Issued</span>
          </div>
          <div className="brw-hero-stat-divider" />
          <div className="brw-hero-stat">
            <span className="brw-hero-stat-num">{totalReturned}</span>
            <span className="brw-hero-stat-label">Returned</span>
          </div>
          <div className="brw-hero-stat-divider" />
          <div className="brw-hero-stat brw-hero-stat--alert">
            <span className="brw-hero-stat-num">{overdue}</span>
            <span className="brw-hero-stat-label">Overdue</span>
          </div>
        </div>
      </div>

      {/* ── Top grid: Issue form + Quick stats ── */}
      <div className="brw-top-grid">
        {/* Issue Book Form */}
        <div className="brw-card">
          <div className="brw-card-header">
            <div className="brw-card-title-row">
              <span className="brw-card-icon brw-ci--indigo">
                <FiPlusCircle />
              </span>
              <div>
                <h2 className="brw-card-title">Issue Book</h2>
                <p className="brw-card-subtitle">
                  Create a borrowing record and decrement available copies
                  automatically
                </p>
              </div>
            </div>
          </div>

          <form className="brw-form" onSubmit={handleIssue}>
            <div className="brw-section-label">Select Borrower & Book</div>
            <div className="brw-grid brw-grid-2">
              <div className="brw-field">
                <label htmlFor="memberId">Member</label>
                <div className="brw-select-wrap">
                  <FiUsers className="brw-select-icon" />
                  <select
                    id="memberId"
                    value={issueForm.memberId}
                    onChange={(e) =>
                      setIssueForm((prev) => ({
                        ...prev,
                        memberId: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Select a member…</option>
                    {members.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="brw-field">
                <label htmlFor="bookId">Book</label>
                <div className="brw-select-wrap">
                  <FiBook className="brw-select-icon" />
                  <select
                    id="bookId"
                    value={issueForm.bookId}
                    onChange={(e) =>
                      setIssueForm((prev) => ({
                        ...prev,
                        bookId: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Select a book…</option>
                    {books.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="brw-section-label">Dates</div>
            <div className="brw-grid brw-grid-2">
              <div className="brw-field">
                <label htmlFor="issueDate">Issue Date</label>
                <input
                  id="issueDate"
                  type="date"
                  value={issueForm.issueDate}
                  onChange={(e) =>
                    setIssueForm((prev) => ({
                      ...prev,
                      issueDate: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="brw-field">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  id="dueDate"
                  type="date"
                  value={issueForm.dueDate}
                  onChange={(e) =>
                    setIssueForm((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="brw-actions">
              <button
                className="brw-btn-ghost"
                type="button"
                onClick={resetForm}
              >
                <FiRefreshCw /> Reset
              </button>
              <button className="brw-btn-primary" type="submit">
                <FiPlusCircle /> Issue Book
              </button>
            </div>
          </form>
        </div>

        {/* Quick stats sidebar */}
        <div className="brw-card">
          <div className="brw-card-header">
            <div className="brw-card-title-row">
              <span className="brw-card-icon brw-ci--teal">
                <FiClock />
              </span>
              <div>
                <h2 className="brw-card-title">Quick Stats</h2>
                <p className="brw-card-subtitle">
                  Live snapshot of borrowing activity
                </p>
              </div>
            </div>
          </div>

          <div className="brw-stats-list">
            <div className="brw-stat-item">
              <div className="brw-stat-icon brw-si--indigo">
                <FiBook />
              </div>
              <div className="brw-stat-body">
                <span className="brw-stat-label">Total Records</span>
                <strong className="brw-stat-value">{records.length}</strong>
              </div>
            </div>
            <div className="brw-stat-item">
              <div className="brw-stat-icon brw-si--amber">
                <FiPlusCircle />
              </div>
              <div className="brw-stat-body">
                <span className="brw-stat-label">Currently Issued</span>
                <strong className="brw-stat-value">{totalIssued}</strong>
              </div>
            </div>
            <div className="brw-stat-item">
              <div className="brw-stat-icon brw-si--green">
                <FiCheckCircle />
              </div>
              <div className="brw-stat-body">
                <span className="brw-stat-label">Returned</span>
                <strong className="brw-stat-value">{totalReturned}</strong>
              </div>
            </div>
            <div className="brw-stat-item">
              <div className="brw-stat-icon brw-si--red">
                <FiAlertCircle />
              </div>
              <div className="brw-stat-body">
                <span className="brw-stat-label">Overdue</span>
                <strong className="brw-stat-value brw-stat-value--danger">
                  {overdue}
                </strong>
              </div>
            </div>
            <div className="brw-stat-item">
              <div className="brw-stat-icon brw-si--teal">
                <FiUsers />
              </div>
              <div className="brw-stat-body">
                <span className="brw-stat-label">Active Members</span>
                <strong className="brw-stat-value">{members.length}</strong>
              </div>
            </div>
            <div className="brw-stat-item">
              <div className="brw-stat-icon brw-si--purple">
                <FiBook />
              </div>
              <div className="brw-stat-body">
                <span className="brw-stat-label">Books in Catalog</span>
                <strong className="brw-stat-value">{books.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Borrow History Table ── */}
      <div className="brw-card">
        <div className="brw-card-header">
          <div className="brw-card-title-row">
            <span className="brw-card-icon brw-ci--coral">
              <FiClock />
            </span>
            <div>
              <h2 className="brw-card-title">Borrow History</h2>
              <p className="brw-card-subtitle">
                Track issue dates, return dates, due dates, and late fines
              </p>
            </div>
          </div>
          <span className="brw-count-badge">{records.length} records</span>
        </div>

        <DataTable
          columns={columns}
          rows={records}
          actions={(row) =>
            row.status === "issued" ? (
              <div className="brw-row-actions">
                <button
                  className="brw-return-btn"
                  title="Mark as returned"
                  onClick={() => handleReturn(row._id)}
                >
                  <FiCheckCircle />
                  <span>Return</span>
                </button>
              </div>
            ) : (
              <div className="brw-row-actions">
                <span className="brw-status-badge brw-status--returned">
                  Returned
                </span>
              </div>
            )
          }
        />
      </div>
    </div>
  );
};

export default BorrowingPage;
