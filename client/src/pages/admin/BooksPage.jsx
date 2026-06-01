import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiBook,
  FiRefreshCw,
  FiLayers,
  FiTag,
  FiBookOpen,
} from "react-icons/fi";
import DataTable from "../../components/dashboard/DataTable";
import Loader from "../../components/common/Loader";
import {
  createBook,
  deleteBook,
  fetchBooks,
  updateBook,
} from "../../services/libraryService";
import { formatCurrency } from "../../utils/helpers";
import { useToast } from "../../contexts/ToastContext";
import "./BooksPage.css";

// ── adjust if your API runs on a different port/host ──
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialForm = {
  title: "",
  author: "",
  isbn: "",
  publisher: "",
  publicationDate: "",
  category: "",
  description: "",
  edition: "",
  language: "",
  shelfLocation: "",
  totalCopies: 1,
  availableCopies: 1,
  price: 0,
};

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(""); // local preview while editing
  const { showToast } = useToast();

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await fetchBooks();
      setBooks(response.books || []);
    } catch (error) {
      showToast(error.message || "Unable to fetch books", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId("");
    setForm(initialForm);
    setFile(null);
    setFileName("");
    setPreview("");
  };

  const handleFileChange = (e) => {
    const chosen = e.target.files[0];
    if (!chosen) return;
    setFile(chosen);
    setFileName(chosen.name);
    // show local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(chosen);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        payload.append(key, value),
      );
      if (file) payload.append("coverImage", file);

      if (editingId) {
        await updateBook(editingId, payload, true);
        showToast("Book updated successfully");
      } else {
        await createBook(payload, true);
        showToast("Book created successfully");
      }

      resetForm();
      loadBooks();
    } catch (error) {
      showToast(error.message || "Unable to save book", "error");
    }
  };

  const onEdit = (book) => {
    setEditingId(book._id);
    setForm({
      title: book.title || "",
      author: book.author || "",
      isbn: book.isbn || "",
      publisher: book.publisher || "",
      publicationDate: book.publicationDate?.slice(0, 10) || "",
      category: book.category || "",
      description: book.description || "",
      edition: book.edition || "",
      language: book.language || "",
      shelfLocation: book.shelfLocation || "",
      totalCopies: book.totalCopies || 1,
      availableCopies: book.availableCopies || 1,
      price: book.price || 0,
    });
    // show existing server image as preview
    setPreview(book.coverImage ? `${API_BASE}${book.coverImage}` : "");
    setFile(null);
    setFileName("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await deleteBook(id);
      showToast("Book deleted");
      loadBooks();
    } catch (error) {
      showToast(error.message || "Unable to delete book", "error");
    }
  };

  // helper — resolve cover URL
  const coverSrc = (coverImage) =>
    coverImage ? `${API_BASE}${coverImage}` : null;

  // ── Table columns ──────────────────────────────────
  const columns = [
    {
      key: "coverImage",
      label: "Cover",
      render: (_, row) => {
        const src = coverSrc(row.coverImage);
        return (
          <div className="bp-cover-cell">
            {src ? (
              <img src={src} alt={row.title} className="bp-cover-thumb" />
            ) : (
              <div className="bp-cover-placeholder">
                {row.title?.charAt(0)?.toUpperCase() || "B"}
              </div>
            )}
          </div>
        );
      },
    },
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    { key: "category", label: "Category" },
    { key: "availableCopies", label: "Available" },
    {
      key: "price",
      label: "Price",
      render: (value) => formatCurrency(value),
    },
  ];

  // ── Derived stats ──────────────────────────────────
  const totalCopies = books.reduce((s, b) => s + (b.totalCopies || 0), 0);
  const availableCopies = books.reduce(
    (s, b) => s + (b.availableCopies || 0),
    0,
  );
  const categories = new Set(books.map((b) => b.category).filter(Boolean)).size;

  return loading ? (
    <Loader />
  ) : (
    <div className="books-page">
      {/* ── Hero ── */}
      <div className="bp-hero">
        <div className="bp-hero-inner">
          <span className="bp-hero-tag">Catalog Management</span>
          <h1 className="bp-hero-title">Books</h1>
          <p className="bp-hero-desc">
            Add, edit, and manage the full library catalog — metadata, stock,
            pricing, and cover images.
          </p>
        </div>
        <div className="bp-hero-stat">
          <span className="bp-hero-stat-num">{books.length}</span>
          <span className="bp-hero-stat-label">Total Titles</span>
        </div>
      </div>

      {/* ── Top grid: form + summary ── */}
      <div className="bp-top-grid">
        {/* ── Form Card ── */}
        <div className="bp-card">
          <div className="bp-card-header">
            <div className="bp-card-title-row">
              <span className="bp-card-icon">
                <FiBook />
              </span>
              <div>
                <h2 className="bp-card-title">
                  {editingId ? "Edit Book" : "Add New Book"}
                </h2>
                <p className="bp-card-subtitle">
                  Manage catalog metadata, cover image, and stock details
                </p>
              </div>
            </div>
            {editingId && <span className="bp-editing-badge">Editing</span>}
          </div>

          <form className="bp-form" onSubmit={handleSubmit}>
            <div className="bp-section-label">Core Details</div>
            <div className="bp-grid bp-grid-2">
              <div className="bp-field">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  type="text"
                  placeholder="Book title"
                />
              </div>
              <div className="bp-field">
                <label htmlFor="author">Author</label>
                <input
                  id="author"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  type="text"
                  placeholder="Author name"
                />
              </div>
              <div className="bp-field">
                <label htmlFor="isbn">ISBN</label>
                <input
                  id="isbn"
                  name="isbn"
                  value={form.isbn}
                  onChange={handleChange}
                  type="text"
                  placeholder="978-x-xxx-xxxxx-x"
                />
              </div>
              <div className="bp-field">
                <label htmlFor="category">Category</label>
                <input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Fiction"
                />
              </div>
            </div>

            <div className="bp-section-label">Publishing Info</div>
            <div className="bp-grid bp-grid-2">
              <div className="bp-field">
                <label htmlFor="publisher">Publisher</label>
                <input
                  id="publisher"
                  name="publisher"
                  value={form.publisher}
                  onChange={handleChange}
                  type="text"
                  placeholder="Publisher name"
                />
              </div>
              <div className="bp-field">
                <label htmlFor="publicationDate">Publication Date</label>
                <input
                  id="publicationDate"
                  name="publicationDate"
                  value={form.publicationDate}
                  onChange={handleChange}
                  type="date"
                />
              </div>
              <div className="bp-field">
                <label htmlFor="edition">Edition</label>
                <input
                  id="edition"
                  name="edition"
                  value={form.edition}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. 3rd"
                />
              </div>
              <div className="bp-field">
                <label htmlFor="language">Language</label>
                <input
                  id="language"
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. English"
                />
              </div>
            </div>

            <div className="bp-section-label">Inventory & Pricing</div>
            <div className="bp-grid bp-grid-2">
              <div className="bp-field">
                <label htmlFor="shelfLocation">Shelf Location</label>
                <input
                  id="shelfLocation"
                  name="shelfLocation"
                  value={form.shelfLocation}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. A-12"
                />
              </div>
              <div className="bp-field">
                <label htmlFor="price">Price (₹)</label>
                <input
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  placeholder="0.00"
                />
              </div>
              <div className="bp-field">
                <label htmlFor="totalCopies">Total Copies</label>
                <input
                  id="totalCopies"
                  name="totalCopies"
                  value={form.totalCopies}
                  onChange={handleChange}
                  type="number"
                  min="1"
                />
              </div>
              <div className="bp-field">
                <label htmlFor="availableCopies">Available Copies</label>
                <input
                  id="availableCopies"
                  name="availableCopies"
                  value={form.availableCopies}
                  onChange={handleChange}
                  type="number"
                  min="0"
                />
              </div>
            </div>

            <div className="bp-grid bp-grid-1">
              <div className="bp-field">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Brief synopsis or notes…"
                />
              </div>
            </div>

            {/* ── Cover upload with preview ── */}
            <div className="bp-grid bp-grid-1">
              <div className="bp-field">
                <label>Cover Image</label>
                <div className="bp-cover-upload-row">
                  {/* Preview pane */}
                  <div className="bp-cover-preview-wrap">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Cover preview"
                        className="bp-cover-preview-img"
                      />
                    ) : (
                      <div className="bp-cover-preview-empty">
                        <FiBook />
                        <span>No cover</span>
                      </div>
                    )}
                  </div>

                  {/* Drop zone */}
                  <label className="bp-file-label" htmlFor="coverImage">
                    <span className="bp-file-icon">
                      <FiPlus />
                    </span>
                    <div className="bp-file-body">
                      <span className="bp-file-text">
                        {fileName ||
                          (editingId
                            ? "Replace cover image"
                            : "Upload cover image")}
                      </span>
                      <span className="bp-file-hint">
                        PNG · JPG · WEBP · up to 5 MB
                      </span>
                    </div>
                    <input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      className="bp-file-input"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="bp-actions">
              <button
                className="bp-btn-ghost"
                type="button"
                onClick={resetForm}
              >
                <FiRefreshCw /> Reset
              </button>
              <button className="bp-btn-primary" type="submit">
                <FiPlus />
                {editingId ? "Update Book" : "Add Book"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Summary Card ── */}
        <div className="bp-card bp-summary-card">
          <div className="bp-card-header">
            <div className="bp-card-title-row">
              <span className="bp-card-icon bp-card-icon--teal">
                <FiBookOpen />
              </span>
              <div>
                <h2 className="bp-card-title">Quick Summary</h2>
                <p className="bp-card-subtitle">
                  Live snapshot of catalog stats
                </p>
              </div>
            </div>
          </div>

          <div className="bp-summary-list">
            <div className="bp-summary-item">
              <div className="bp-summary-icon bp-si--indigo">
                <FiBook />
              </div>
              <div className="bp-summary-body">
                <span className="bp-summary-label">Total Titles</span>
                <strong className="bp-summary-value">{books.length}</strong>
              </div>
            </div>
            <div className="bp-summary-item">
              <div className="bp-summary-icon bp-si--teal">
                <FiLayers />
              </div>
              <div className="bp-summary-body">
                <span className="bp-summary-label">Total Copies</span>
                <strong className="bp-summary-value">{totalCopies}</strong>
              </div>
            </div>
            <div className="bp-summary-item">
              <div className="bp-summary-icon bp-si--green">
                <FiBookOpen />
              </div>
              <div className="bp-summary-body">
                <span className="bp-summary-label">Available Copies</span>
                <strong className="bp-summary-value">{availableCopies}</strong>
              </div>
            </div>
            <div className="bp-summary-item">
              <div className="bp-summary-icon bp-si--amber">
                <FiTag />
              </div>
              <div className="bp-summary-body">
                <span className="bp-summary-label">Categories</span>
                <strong className="bp-summary-value">{categories}</strong>
              </div>
            </div>
            <div className="bp-summary-item">
              <div className="bp-summary-icon bp-si--coral">
                <FiEdit2 />
              </div>
              <div className="bp-summary-body">
                <span className="bp-summary-label">Form Mode</span>
                <strong className="bp-summary-value">
                  {editingId ? "Editing" : "Creating"}
                </strong>
              </div>
            </div>
            <div className="bp-summary-item">
              <div className="bp-summary-icon bp-si--purple">
                <FiBook />
              </div>
              <div className="bp-summary-body">
                <span className="bp-summary-label">Latest Title</span>
                <strong className="bp-summary-value bp-summary-value--trunc">
                  {books[0]?.title || "—"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Catalog Table Card ── */}
      <div className="bp-card">
        <div className="bp-card-header">
          <div className="bp-card-title-row">
            <span className="bp-card-icon bp-card-icon--coral">
              <FiBook />
            </span>
            <div>
              <h2 className="bp-card-title">Library Catalog</h2>
              <p className="bp-card-subtitle">
                Search, edit, and maintain catalog inventory
              </p>
            </div>
          </div>
          <span className="bp-count-badge">{books.length} books</span>
        </div>

        <DataTable
          columns={columns}
          rows={books}
          actions={(row) => (
            <div className="bp-row-actions">
              <button
                type="button"
                className="bp-icon-btn"
                title="Edit book"
                onClick={() => onEdit(row)}
              >
                <FiEdit2 />
              </button>
              <button
                type="button"
                className="bp-icon-btn bp-icon-btn--danger"
                title="Delete book"
                onClick={() => onDelete(row._id)}
              >
                <FiTrash2 />
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default BooksPage;
