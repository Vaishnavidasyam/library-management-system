import { useEffect, useState } from "react";
import { FiFileText, FiGrid, FiBarChart2 } from "react-icons/fi";
import {
  exportExcelReport,
  exportPdfReport,
  fetchReports,
} from "../../services/libraryService";
import { downloadBlob, formatCurrency } from "../../utils/helpers";
import DataTable from "../../components/dashboard/DataTable"; // if you want to show any table later
import Loader from "../../components/common/Loader";
import { useToast } from "../../contexts/ToastContext";
import "./ReportsPage.css";

const reportTypes = ["borrow", "fine", "inventory", "member"];

const ReportsPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetchReports();
        setReport(response);
      } catch (error) {
        showToast(error.message || "Unable to fetch reports", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleExport = async (type, format) => {
    try {
      const blob =
        format === "pdf"
          ? await exportPdfReport(type)
          : await exportExcelReport(type);
      downloadBlob(blob, `${type}-report.${format === "pdf" ? "pdf" : "xlsx"}`);
      showToast(`${type} report exported`);
    } catch (error) {
      showToast(error.message || "Export failed", "error");
    }
  };

  if (loading) return <Loader />;

  const summary = report?.summary || {};

  return (
    <div className="rep-page">
      {/* ── Hero ── */}
      <div className="rep-hero">
        <div className="rep-hero-inner">
          <span className="rep-hero-tag">Reports & Analytics</span>
          <h1 className="rep-hero-title">Reports</h1>
          <p className="rep-hero-desc">
            Get a consolidated view of your library performance and export
            detailed reports for finance, operations, and stakeholders.
          </p>
        </div>

        <div className="rep-hero-stats">
          <div className="rep-hero-stat">
            <span className="rep-hero-stat-label">Total Revenue</span>
            <span className="rep-hero-stat-num">
              {formatCurrency(summary.revenue || 0)}
            </span>
          </div>
          <div className="rep-hero-stat-divider" />
          <div className="rep-hero-stat">
            <span className="rep-hero-stat-label">Borrowed This Month</span>
            <span className="rep-hero-stat-num">{summary.borrowed || 0}</span>
          </div>
          <div className="rep-hero-stat-divider" />
          <div className="rep-hero-stat">
            <span className="rep-hero-stat-label">Inventory At Risk</span>
            <span className="rep-hero-stat-num">
              {summary.inventoryRisk || 0}
            </span>
          </div>
          <div className="rep-hero-stat-divider" />
          <div className="rep-hero-stat">
            <span className="rep-hero-stat-label">Active Members</span>
            <span className="rep-hero-stat-num">{summary.members || 0}</span>
          </div>
        </div>
      </div>

      {/* ── Analytics Summary Card ── */}
      <div className="rep-card">
        <div className="rep-card-header">
          <div className="rep-card-title-row">
            <span className="rep-card-icon rep-ci--indigo">
              <FiBarChart2 />
            </span>
            <div>
              <h2 className="rep-card-title">Analytics Summary</h2>
              <p className="rep-card-subtitle">
                Enterprise-grade overview of key performance indicators for your
                library.
              </p>
            </div>
          </div>
        </div>

        <div className="rep-metrics-grid">
          <div className="rep-metric-card">
            <span className="rep-metric-label">Total Revenue</span>
            <strong className="rep-metric-value">
              {formatCurrency(summary.revenue || 0)}
            </strong>
          </div>
          <div className="rep-metric-card">
            <span className="rep-metric-label">Borrowed This Month</span>
            <strong className="rep-metric-value">
              {summary.borrowed || 0}
            </strong>
          </div>
          <div className="rep-metric-card">
            <span className="rep-metric-label">Inventory At Risk</span>
            <strong className="rep-metric-value">
              {summary.inventoryRisk || 0}
            </strong>
          </div>
          <div className="rep-metric-card">
            <span className="rep-metric-label">Active Members</span>
            <strong className="rep-metric-value">{summary.members || 0}</strong>
          </div>
        </div>
      </div>

      {/* ── Export Center Card ── */}
      <div className="rep-card">
        <div className="rep-card-header">
          <div className="rep-card-title-row">
            <span className="rep-card-icon rep-ci--teal">
              <FiFileText />
            </span>
            <div>
              <h2 className="rep-card-title">Export Center</h2>
              <p className="rep-card-subtitle">
                Generate polished PDF or Excel reports for audits, reviews, and
                external sharing.
              </p>
            </div>
          </div>
        </div>

        <div className="rep-export-grid">
          {reportTypes.map((type) => (
            <div key={type} className="rep-export-card rep-glass-card">
              <h4>{type} report</h4>
              <p className="rep-export-desc">
                Download a detailed {type} report with filters and breakdowns.
              </p>
              <div className="rep-export-actions">
                <button
                  className="rep-btn-ghost"
                  onClick={() => handleExport(type, "pdf")}
                >
                  <FiFileText />
                  PDF
                </button>
                <button
                  className="rep-btn-primary"
                  onClick={() => handleExport(type, "excel")}
                >
                  <FiGrid />
                  Excel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
