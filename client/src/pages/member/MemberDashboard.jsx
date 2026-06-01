import { useEffect, useState } from "react";
import { FiBookOpen, FiClock, FiDollarSign, FiStar } from "react-icons/fi";
import {
  fetchDashboardStats,
  fetchMyRecommendations,
} from "../../services/libraryService";
import Loader from "../../components/common/Loader";
import { formatCurrency } from "../../utils/helpers";
import { useToast } from "../../contexts/ToastContext";
import "./MemberDashboard.css";

const MemberDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [dashboard, recs] = await Promise.all([
          fetchDashboardStats(),
          fetchMyRecommendations(),
        ]);
        setStats(dashboard.memberSummary || {});
        setRecommendations(recs.books || []);
      } catch (error) {
        showToast(error.message || "Unable to load member dashboard", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  if (loading) return <Loader />;

  const borrowed = stats?.borrowed || 0;
  const dueSoon = stats?.dueSoon || 0;
  const reservations = stats?.reservations || 0;
  const outstandingFine = stats?.fineAmount || 0;

  return (
    <div className="mem-page">
      {/* ── Hero ── */}
      <div className="mem-hero">
        <div className="mem-hero-inner">
          <span className="mem-hero-tag">Welcome back</span>
          <h1 className="mem-hero-title">Member Dashboard</h1>
          <p className="mem-hero-desc">
            Keep track of your current loans, upcoming due dates, and reading
            progress — all in one clean dashboard.
          </p>
        </div>

        <div className="mem-hero-stats">
          <div className="mem-hero-stat">
            <span className="mem-hero-stat-num">{borrowed}</span>
            <span className="mem-hero-stat-label">Borrowed</span>
          </div>
          <div className="mem-hero-stat-divider" />
          <div className="mem-hero-stat">
            <span className="mem-hero-stat-num">{dueSoon}</span>
            <span className="mem-hero-stat-label">Due Soon</span>
          </div>
          <div className="mem-hero-stat-divider" />
          <div className="mem-hero-stat">
            <span className="mem-hero-stat-num">{reservations}</span>
            <span className="mem-hero-stat-label">Reserved</span>
          </div>
          <div className="mem-hero-stat-divider" />
          <div className="mem-hero-stat mem-hero-stat--alert">
            <span className="mem-hero-stat-num">
              {formatCurrency(outstandingFine)}
            </span>
            <span className="mem-hero-stat-label">Outstanding Fine</span>
          </div>
        </div>
      </div>

      {/* ── Stat cards row ── */}
      <div className="mem-stats-grid">
        <div className="mem-stat-card">
          <div className="mem-stat-icon mem-si--indigo">
            <FiBookOpen />
          </div>
          <div>
            <div className="mem-stat-label">Borrowed Books</div>
            <div className="mem-stat-value">{borrowed}</div>
            <div className="mem-stat-helper">Currently checked out</div>
          </div>
        </div>

        <div className="mem-stat-card">
          <div className="mem-stat-icon mem-si--amber">
            <FiClock />
          </div>
          <div>
            <div className="mem-stat-label">Due Soon</div>
            <div className="mem-stat-value">{dueSoon}</div>
            <div className="mem-stat-helper">Return deadlines ahead</div>
          </div>
        </div>

        <div className="mem-stat-card">
          <div className="mem-stat-icon mem-si--purple">
            <FiStar />
          </div>
          <div>
            <div className="mem-stat-label">Reserved Books</div>
            <div className="mem-stat-value">{reservations}</div>
            <div className="mem-stat-helper">Titles in your queue</div>
          </div>
        </div>

        <div className="mem-stat-card">
          <div className="mem-stat-icon mem-si--teal">
            <FiDollarSign />
          </div>
          <div>
            <div className="mem-stat-label">Fine Amount</div>
            <div className="mem-stat-value">
              {formatCurrency(outstandingFine)}
            </div>
            <div className="mem-stat-helper">Outstanding balance</div>
          </div>
        </div>
      </div>

      {/* ── Bottom grid: Reading stats + Recommendations ── */}
      <div className="mem-bottom-grid">
        {/* Reading stats */}
        <div className="mem-card">
          <div className="mem-card-header">
            <div>
              <h2 className="mem-card-title">Reading Statistics</h2>
              <p className="mem-card-subtitle">
                Your reading momentum and borrowing habits
              </p>
            </div>
          </div>

          <div className="mem-metrics-grid">
            <div className="mem-metric-card">
              <span className="mem-metric-label">Returned on time</span>
              <strong className="mem-metric-value">
                {stats?.onTimeRate || "94%"}
              </strong>
            </div>
            <div className="mem-metric-card">
              <span className="mem-metric-label">Genres explored</span>
              <strong className="mem-metric-value">{stats?.genres || 5}</strong>
            </div>
            <div className="mem-metric-card">
              <span className="mem-metric-label">This month</span>
              <strong className="mem-metric-value">
                {stats?.monthlyBorrows || 0}
              </strong>
            </div>
            <div className="mem-metric-card">
              <span className="mem-metric-label">Lifetime reads</span>
              <strong className="mem-metric-value">
                {stats?.lifetimeBorrows || 0}
              </strong>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mem-card">
          <div className="mem-card-header">
            <div>
              <h2 className="mem-card-title">Recommended Books</h2>
              <p className="mem-card-subtitle">
                Suggestions based on your borrowing patterns
              </p>
            </div>
          </div>

          {recommendations.length === 0 ? (
            <div className="mem-empty-state">
              <h4>No recommendations yet</h4>
              <p>
                Borrow a few books and we&apos;ll start curating suggestions
                just for you.
              </p>
            </div>
          ) : (
            <div className="mem-list-stack">
              {recommendations.map((book) => (
                <div className="mem-list-item" key={book._id}>
                  <div>
                    <strong>{book.title}</strong>
                    <p>{book.author}</p>
                  </div>
                  <span className="mem-pill">
                    <FiStar />
                    Based on your reads
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

export default MemberDashboard;
