import { useEffect, useState } from "react";
import { FiBook, FiUsers, FiDollarSign, FiClipboard } from "react-icons/fi";

import { fetchDashboardStats } from "../../services/libraryService";
import { formatCurrency, formatDate } from "../../utils/helpers";
import { useToast } from "../../contexts/ToastContext";
import "./AdminDashboard.css";
import Loader from "../../components/common/Loader";
import StatCard from "../../components/dashboard/StatCard";
import SectionCard from "../../components/dashboard/SectionCard";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { showToast } = useToast();

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetchDashboardStats();
      setData(response);
    } catch (error) {
      showToast(error.message || "Unable to load dashboard", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) return <Loader />;

  const stats = [
    {
      title: "Total Books",
      value: data?.totals?.books ?? 0,
      helper: "Cataloged Titles",
      icon: <FiBook />,
    },
    {
      title: "Members",
      value: data?.totals?.members ?? 0,
      helper: "Active Users",
      icon: <FiUsers />,
    },
    {
      title: "Borrowed",
      value: data?.totals?.borrowed ?? 0,
      helper: "Currently Issued",
      icon: <FiClipboard />,
    },
    {
      title: "Revenue",
      value: formatCurrency(data?.totals?.revenue ?? 0),
      helper: "Fine Collections",
      icon: <FiDollarSign />,
    },
  ];

  const quickActions = [
    {
      icon: <FiBook />,
      title: "Add New Book",
      description: "Create a new catalog entry",
    },
    {
      icon: <FiUsers />,
      title: "Add Member",
      description: "Register a new member",
    },
    {
      icon: <FiClipboard />,
      title: "Issue Book",
      description: "Borrow and circulation",
    },
    {
      icon: <FiDollarSign />,
      title: "Revenue",
      description: "Track collections",
    },
  ];

  return (
    <div className="dashboard-page">
      {/* HERO */}
      <header className="dashboard-hero">
        <div className="dashboard-hero-content">
          <span className="dashboard-tag">ENTERPRISE LIBRARY WORKSPACE</span>
          <h1>Admin Dashboard</h1>
          <p>
            Monitor books, members, circulation, reservations, inventory, and
            overall library performance from a single workspace.
          </p>
        </div>
      </header>

      {/* KPI STATS */}
      <section className="stats-grid">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </section>

      {/* QUICK ACTIONS */}
      <section className="quick-actions-grid">
        {quickActions.map((action, idx) => (
          <button key={idx} className="quick-action-card" type="button">
            <div className="quick-action-icon">{action.icon}</div>
            <h4>{action.title}</h4>
            <p>{action.description}</p>
          </button>
        ))}
      </section>

      {/* SECOND ROW: Most Borrowed + Recent Activity */}
      <section className="content-grid">
        <SectionCard
          title="Most Borrowed Books"
          subtitle="Top performing titles"
        >
          <div className="list-stack">
            {(data?.mostBorrowedBooks ?? []).map((book) => (
              <div className="list-item" key={book._id}>
                <div className="list-item-content">
                  <strong>{book.title}</strong>
                  <p>{book.author}</p>
                </div>
                <span className="status-badge">{book.borrowCount}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent Activity" subtitle="Latest actions">
          <div className="timeline-stack">
            {(data?.recentActivity ?? []).map((item) => (
              <div className="timeline-item" key={item._id}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <strong>{item.action}</strong>
                  <p>{item.description}</p>
                  <small>{formatDate(item.createdAt)}</small>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      {/* THIRD ROW: Library Status + Notifications */}
      <section className="content-grid">
        <SectionCard title="Library Status" subtitle="System overview">
          <div className="mini-metrics">
            <div className="mini-metric">
              <span>Pending Returns</span>
              <strong>{data?.totals?.pendingReturns ?? 0}</strong>
            </div>
            <div className="mini-metric">
              <span>Reservations</span>
              <strong>{data?.totals?.reservations ?? 0}</strong>
            </div>
            <div className="mini-metric">
              <span>Fine Balance</span>
              <strong>{formatCurrency(data?.totals?.fines ?? 0)}</strong>
            </div>
            <div className="mini-metric">
              <span>Inventory Health</span>
              <strong>{data?.inventoryHealth ?? "Healthy"}</strong>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Notifications" subtitle="Recent alerts">
          <div className="list-stack compact">
            {(data?.recentNotifications ?? []).map((item) => (
              <div className="list-item" key={item._id}>
                <div className="list-item-content">
                  <strong>{item.title}</strong>
                  <p>{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      {/* RECENT BOOKS */}
      <section>
        <SectionCard title="Recently Added Books" subtitle="Latest additions">
          <div className="recent-books-grid">
            {(data?.recentBooks ?? []).map((book) => (
              <div className="recent-book-card" key={book._id}>
                <div className="recent-book-image">
                  {book.coverImage ? (
                    <img
                      src={`${API_BASE}${book.coverImage}`}
                      alt={book.title}
                      className="recent-book-img"
                    />
                  ) : (
                    <div className="book-cover-placeholder">
                      <FiBook />
                    </div>
                  )}
                </div>
                <h4>{book.title}</h4>
                <p>{book.category}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  );
};

export default AdminDashboard;
