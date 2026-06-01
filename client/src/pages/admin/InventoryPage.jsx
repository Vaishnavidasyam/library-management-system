import { useEffect, useState } from "react";
import { FiBox, FiAlertTriangle } from "react-icons/fi";
import { fetchBooks } from "../../services/libraryService";
import Loader from "../../components/common/Loader";
import { useToast } from "../../contexts/ToastContext";
import "./InventoryPage.css";

const mockBooks = [
  {
    _id: "1",
    title: "Clean Code",
    availableCopies: 1,
    condition: "good",
    status: "available",
  },
  {
    _id: "2",
    title: "Introduction to Algorithms",
    availableCopies: 5,
    condition: "good",
    status: "available",
  },
  {
    _id: "3",
    title: "Design Patterns",
    availableCopies: 0,
    condition: "damaged",
    status: "missing",
  },
  {
    _id: "4",
    title: "Deep Learning with Python",
    availableCopies: 2,
    condition: "good",
    status: "available",
  },
];

const InventoryPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetchBooks();
        const fetched = response.books || [];
        // Use backend data if available, else mock data for UI
        setBooks(fetched.length ? fetched : mockBooks);
      } catch (error) {
        showToast(error.message || "Unable to load inventory", "error");
        // Fallback to mock data on error so UI is not empty
        setBooks(mockBooks);
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  if (loading) return <Loader />;

  const lowStock = books.filter((book) => (book.availableCopies ?? 0) <= 2);
  const damaged = books.filter((book) => book.condition === "damaged");
  const missing = books.filter((book) => book.status === "missing");

  return (
    <div className="inv-page">
      {/* ── Hero ── */}
      <div className="inv-hero">
        <div className="inv-hero-inner">
          <span className="inv-hero-tag">Inventory Control</span>
          <h1 className="inv-hero-title">Inventory</h1>
          <p className="inv-hero-desc">
            Monitor stock levels, damaged copies, and missing items to keep your
            shelves healthy and members satisfied.
          </p>
        </div>

        <div className="inv-hero-stats">
          <div className="inv-hero-stat">
            <span className="inv-hero-stat-label">Total Titles</span>
            <span className="inv-hero-stat-num">{books.length}</span>
          </div>
          <div className="inv-hero-stat-divider" />
          <div className="inv-hero-stat">
            <span className="inv-hero-stat-label">Low Stock</span>
            <span className="inv-hero-stat-num">{lowStock.length}</span>
          </div>
          <div className="inv-hero-stat-divider" />
          <div className="inv-hero-stat">
            <span className="inv-hero-stat-label">Damaged</span>
            <span className="inv-hero-stat-num">{damaged.length}</span>
          </div>
          <div className="inv-hero-stat-divider" />
          <div className="inv-hero-stat inv-hero-stat--alert">
            <span className="inv-hero-stat-label">Missing</span>
            <span className="inv-hero-stat-num">{missing.length}</span>
          </div>
        </div>
      </div>

      {/* ── Two cards grid ── */}
      <div className="inv-grid">
        {/* Inventory Dashboard card */}
        <div className="inv-card">
          <div className="inv-card-header">
            <div className="inv-card-title-row">
              <span className="inv-card-icon inv-ci--indigo">
                <FiBox />
              </span>
              <div>
                <h2 className="inv-card-title">Inventory Dashboard</h2>
                <p className="inv-card-subtitle">
                  Track available, low stock, damaged, and missing titles at a
                  glance.
                </p>
              </div>
            </div>
          </div>

          <div className="inv-metrics-grid">
            <div className="inv-metric-card">
              <span className="inv-metric-label">Total Titles</span>
              <strong className="inv-metric-value">{books.length}</strong>
            </div>
            <div className="inv-metric-card">
              <span className="inv-metric-label">Low Stock (≤ 2)</span>
              <strong className="inv-metric-value">{lowStock.length}</strong>
            </div>
            <div className="inv-metric-card">
              <span className="inv-metric-label">Damaged</span>
              <strong className="inv-metric-value">{damaged.length}</strong>
            </div>
            <div className="inv-metric-card">
              <span className="inv-metric-label">Missing</span>
              <strong className="inv-metric-value">{missing.length}</strong>
            </div>
          </div>
        </div>

        {/* Low stock card */}
        <div className="inv-card">
          <div className="inv-card-header">
            <div className="inv-card-title-row">
              <span className="inv-card-icon inv-ci--amber">
                <FiAlertTriangle />
              </span>
              <div>
                <h2 className="inv-card-title">Low Stock Books</h2>
                <p className="inv-card-subtitle">
                  Restock these titles soon to avoid member dissatisfaction.
                </p>
              </div>
            </div>
          </div>

          {lowStock.length === 0 ? (
            <div className="inv-empty-state">
              <h4>All clear!</h4>
              <p>No titles are currently in the low stock threshold.</p>
            </div>
          ) : (
            <div className="inv-list-stack">
              {lowStock.map((book) => (
                <div key={book._id} className="inv-list-item">
                  <div>
                    <strong>{book.title}</strong>
                    <p>
                      {book.availableCopies} available ·{" "}
                      {book.condition === "damaged"
                        ? "Damaged"
                        : "Good condition"}
                    </p>
                  </div>
                  <span className="inv-stock-badge">
                    {book.availableCopies} in stock
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
