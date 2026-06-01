import { useEffect, useState } from "react";
import { FiBookmark } from "react-icons/fi";
import { fetchReservations } from "../../services/libraryService";
import DataTable from "../../components/dashboard/DataTable";
import SectionCard from "../../components/dashboard/SectionCard";
import Loader from "../../components/common/Loader";
import { useToast } from "../../contexts/ToastContext";
import { formatDate } from "../../utils/helpers";
import "./MyReservationsPage.css";

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetchReservations({ mine: true });
        setReservations(response.reservations || []);
      } catch (error) {
        showToast(error.message || "Unable to fetch reservations", "error");
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
      key: "status",
      label: "Status",
      render: (value) => {
        const normalized = (value || "").toLowerCase();
        if (normalized === "approved") {
          return <span className="mr-badge mr-badge--success">Approved</span>;
        }
        if (normalized === "rejected") {
          return <span className="mr-badge mr-badge--danger">Rejected</span>;
        }
        // pending or any other
        return (
          <span className="mr-badge mr-badge--info">{value || "Pending"}</span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Requested",
      render: (value) => formatDate(value),
    },
  ];

  return (
    <div className="mr-page">
      <div className="mr-hero">
        <div className="mr-hero-inner">
          <span className="mr-hero-tag">My requests</span>
          <h1 className="mr-hero-title">My Reservations</h1>
          <p className="mr-hero-desc">
            View all your pending, approved, and rejected reservation requests
            in one place.
          </p>
        </div>

        <div className="mr-hero-pill">
          <FiBookmark />
          <span>{reservations.length} total reservations</span>
        </div>
      </div>

      <SectionCard
        title="Reservation History"
        subtitle="Track the status of your reservation requests"
      >
        <div className="mr-table-wrapper">
          <DataTable columns={columns} rows={reservations} />
        </div>
      </SectionCard>
    </div>
  );
};

export default MyReservationsPage;
