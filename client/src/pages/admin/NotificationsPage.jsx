import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../../services/libraryService";
import { formatDate } from "../../utils/helpers";
import Loader from "../../components/common/Loader";
import { useToast } from "../../contexts/ToastContext";
import "./NotificationsPage.css";

const mockNotifications = [
  {
    _id: "1",
    title: 'Due reminder: "Clean Code"',
    message: "The book is due tomorrow. Send a reminder to the member.",
    createdAt: new Date().toISOString(),
    read: false,
    type: "due",
  },
  {
    _id: "2",
    title: "Reservation approved",
    message: 'Reservation for "Deep Learning with Python" has been approved.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: false,
    type: "reservation",
  },
  {
    _id: "3",
    title: "Fine payment received",
    message: "Fine of ₹150 has been marked as paid by John Doe.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    read: true,
    type: "fine",
  },
  {
    _id: "4",
    title: "Inventory alert: Low stock",
    message:
      '"Design Patterns" is running low in stock. Only 1 copy remaining.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
    type: "inventory",
  },
];

const NotificationsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const response = await fetchNotifications();
      const list = response.notifications || [];
      setItems(list.length ? list : mockNotifications);
    } catch (error) {
      showToast(error.message || "Unable to load notifications", "error");
      // fallback so UI is not empty
      setItems(mockNotifications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleClick = async (item) => {
    try {
      if (!item.read && item._id && !item._id.startsWith("mock-")) {
        await markNotificationAsRead(item._id);
      }
    } catch (error) {
      showToast(error.message || "Unable to update notification", "error");
    } finally {
      load();
    }
  };

  if (loading) return <Loader />;

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="not-page">
      {/* ── Hero ── */}
      <div className="not-hero">
        <div className="not-hero-inner">
          <span className="not-hero-tag">Notification Center</span>
          <h1 className="not-hero-title">Notifications</h1>
          <p className="not-hero-desc">
            See due reminders, reservation updates, fines, and inventory alerts
            in a single, organized timeline.
          </p>
        </div>

        <div className="not-hero-stats">
          <div className="not-hero-stat">
            <span className="not-hero-stat-label">Total</span>
            <span className="not-hero-stat-num">{items.length}</span>
          </div>
          <div className="not-hero-stat-divider" />
          <div className="not-hero-stat">
            <span className="not-hero-stat-label">Unread</span>
            <span className="not-hero-stat-num">{unreadCount}</span>
          </div>
        </div>
      </div>

      {/* ── Timeline card ── */}
      <div className="not-card">
        <div className="not-card-header">
          <div className="not-card-title-row">
            <div>
              <h2 className="not-card-title">Activity Timeline</h2>
              <p className="not-card-subtitle">
                Tap a notification to mark it as read and keep your queue clean.
              </p>
            </div>
            <span className="not-count-badge">
              {unreadCount} unread · {items.length - unreadCount} read
            </span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <h4>All caught up</h4>
            <p>You have no notifications at the moment.</p>
          </div>
        ) : (
          <div className="timeline-stack">
            {items.map((item) => (
              <div
                key={item._id}
                className={`timeline-item ${
                  item.read ? "read" : "unread"
                } clickable`}
                onClick={() => handleClick(item)}
              >
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <strong>
                    {item.title}
                    <span
                      className={`notification-status ${
                        item.read ? "read" : "unread"
                      }`}
                    >
                      {item.read ? "Read" : "Unread"}
                    </span>
                  </strong>
                  <p>{item.message}</p>
                  <small>{formatDate(item.createdAt)}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
