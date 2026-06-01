import { useEffect, useState } from "react";
import { FiBookmark, FiSearch, FiBook, FiX } from "react-icons/fi";
import { createReservation, fetchBooks } from "../../services/libraryService";
import Loader from "../../components/common/Loader";
import { useToast } from "../../contexts/ToastContext";
import { formatCurrency } from "../../utils/helpers";
import "./BrowseBooksPage.css";

// ── adjust if your API runs on a different host ──
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const BrowseBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { showToast } = useToast();

  const load = async (search = "") => {
    try {
      setLoading(true);
      const response = await fetchBooks({ search: search.trim() || undefined });
      setBooks(response.books || []);
    } catch (error) {
      showToast(error.message || "Unable to browse books", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(query);
  };

  const clearSearch = () => {
    setQuery("");
    load("");
  };

  const reserve = async (bookId) => {
    try {
      await createReservation({ bookId });
      showToast("Book reserved successfully");
    } catch (error) {
      showToast(error.message || "Unable to reserve book", "error");
    }
  };

  // resolve cover URL from server path
  const coverSrc = (coverImage) =>
    coverImage ? `${API_BASE}${coverImage}` : null;

  // availability colour
  const availBadge = (n) => {
    if (n <= 0) return "bb-avail-badge bb-avail--none";
    if (n <= 2) return "bb-avail-badge bb-avail--low";
    return "bb-avail-badge bb-avail--ok";
  };

  if (loading) return <Loader />;

  return (
    <div className="bb-page">
      {/* ── Hero + Search ── */}
      <div className="bb-hero">
        <div className="bb-hero-inner">
          <span className="bb-hero-tag">Discover</span>
          <h1 className="bb-hero-title">Browse Books</h1>
          <p className="bb-hero-desc">
            Search, filter, and reserve titles from the library collection in a
            clean, distraction-free view.
          </p>
        </div>

        <form className="bb-search-shell" onSubmit={handleSearch}>
          <FiSearch className="bb-search-icon" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or category…"
          />
          {query && (
            <button
              type="button"
              className="bb-search-clear"
              onClick={clearSearch}
            >
              <FiX />
            </button>
          )}
          <button className="bb-search-btn" type="submit">
            Search
          </button>
        </form>
      </div>

      {/* ── Result header ── */}
      <div className="bb-result-bar">
        <span className="bb-result-count">
          {books.length} {books.length === 1 ? "title" : "titles"} found
          {query && (
            <>
              {" "}
              for <em>"{query}"</em>
            </>
          )}
        </span>
      </div>

      {/* ── Books grid ── */}
      {books.length === 0 ? (
        <div className="bb-empty-state">
          <div className="bb-empty-icon">
            <FiBook />
          </div>
          <h4>No books found</h4>
          <p>
            Try a different search term, or{" "}
            <button className="bb-empty-link" onClick={clearSearch}>
              clear the search
            </button>{" "}
            to see all titles.
          </p>
        </div>
      ) : (
        <div className="bb-book-grid">
          {books.map((book) => {
            const src = coverSrc(book.coverImage);
            return (
              <article key={book._id} className="bb-book-tile">
                {/* Cover */}
                <div className="bb-book-cover-wrap">
                  {src ? (
                    <img
                      src={src}
                      alt={book.title}
                      className="bb-book-cover-img"
                    />
                  ) : (
                    <div className="bb-book-cover-placeholder">
                      {book.title?.charAt(0)?.toUpperCase() || "B"}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="bb-book-content">
                  <h4 className="bb-book-title">{book.title}</h4>
                  <p className="bb-book-author">{book.author}</p>
                  <div className="bb-book-meta">
                    {book.category && (
                      <span className="bb-meta-tag">{book.category}</span>
                    )}
                    {book.edition && (
                      <span className="bb-meta-tag">{book.edition} ed.</span>
                    )}
                  </div>
                  <div className="bb-book-footer">
                    <span className={availBadge(book.availableCopies)}>
                      {book.availableCopies > 0
                        ? `${book.availableCopies} available`
                        : "Unavailable"}
                    </span>
                    <span className="bb-book-price">
                      {formatCurrency(book.price || 0)}
                    </span>
                  </div>
                </div>

                {/* Reserve */}
                <div className="bb-book-action">
                  <button
                    className="bb-reserve-btn"
                    type="button"
                    disabled={book.availableCopies <= 0}
                    onClick={() => reserve(book._id)}
                  >
                    <FiBookmark />
                    <span>Reserve</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowseBooksPage;
