import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  BookOpen, CheckCircle, BookMinus, Layers,
  Plus, Search, Edit2, Trash2, ArrowLeftRight, X, Check,
  AlertCircle, RefreshCw, BookMarked, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const CATEGORIES = [
  'Fiction', 'Non-Fiction', 'Science', 'Technology',
  'History', 'Mathematics', 'Literature', 'Biography', 'Other'
];

export default function App() {
  // Main Data States
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({ totalBooks: 0, availableBooks: 0, issuedBooks: 0, totalCategories: 0 });
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Toast Notifications
  const [toast, setToast] = useState(null);

  // Modal (Add / Edit) State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({ bookId: '', title: '', author: '', category: 'Fiction', status: 'AVAILABLE' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Delete Confirmation Dialog State
  const [deletingBook, setDeletingBook] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Fetch Dynamic Dashboard Stats
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/books/stats`);
      setStats(res.data);
    } catch (err) {
      console.error('Stats error', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // 2. Fetch All Books
  const fetchBooks = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/books`);
      setBooks(res.data);
    } catch {
      showToast('Unable to connect to the server. Please try again.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchStats();
  }, []);

  // 3. Search Books
  const handleSearchChange = async (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    const trimmed = query.trim();
    if (!trimmed) {
      fetchBooks();
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/books/search`, { params: { query: trimmed } });
      setBooks(res.data);
    } catch {
      showToast('Search query failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtered & Paginated Books
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchCat = selectedCategory === 'ALL' || b.category === selectedCategory;
      const matchStatus = selectedStatus === 'ALL' || b.status === selectedStatus;
      return matchCat && matchStatus;
    });
  }, [books, selectedCategory, selectedStatus]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage, itemsPerPage]);

  // 4. Modal Open (Add or Edit)
  const openModal = (book = null) => {
    setFormError('');
    if (book) {
      setEditingBook(book);
      setFormData({
        bookId: book.bookId,
        title: book.title,
        author: book.author,
        category: book.category,
        status: book.status
      });
    } else {
      setEditingBook(null);
      setFormData({
        bookId: '',
        title: '',
        author: '',
        category: 'Fiction',
        status: 'AVAILABLE'
      });
    }
    setIsModalOpen(true);
  };

  // 5. Submit Form (Create or Update)
  const handleSaveBook = async (e) => {
    e.preventDefault();
    if (!editingBook && !formData.bookId.trim()) return setFormError('Please enter a Book ID.');
    if (!formData.title.trim()) return setFormError('Please enter the book title.');
    if (!formData.author.trim()) return setFormError('Please enter the author name.');
    if (!formData.category) return setFormError('Please select a category.');

    setFormLoading(true);
    setFormError('');

    try {
      if (editingBook) {
        await axios.put(`${API_BASE_URL}/books/${editingBook.id}`, {
          title: formData.title.trim(),
          author: formData.author.trim(),
          category: formData.category,
          status: formData.status
        });
        showToast('Book updated successfully.', 'success');
      } else {
        await axios.post(`${API_BASE_URL}/books`, {
          bookId: formData.bookId.trim(),
          title: formData.title.trim(),
          author: formData.author.trim(),
          category: formData.category,
          status: formData.status
        });
        showToast('Book added successfully.', 'success');
      }

      setIsModalOpen(false);
      if (searchQuery.trim()) {
        const res = await axios.get(`${API_BASE_URL}/books/search`, { params: { query: searchQuery.trim() } });
        setBooks(res.data);
      } else {
        fetchBooks();
      }
      fetchStats();
    } catch (err) {
      const msg = err.response?.data?.message || (err.response?.status === 409 ? 'A book with this ID already exists.' : 'Unable to save book.');
      setFormError(msg);
      showToast(msg, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // 6. Toggle Status (Available <-> Issued)
  const handleToggleStatus = async (book) => {
    const nextStatus = book.status === 'AVAILABLE' ? 'ISSUED' : 'AVAILABLE';
    const displayStatus = nextStatus === 'AVAILABLE' ? 'Available' : 'Issued';
    try {
      await axios.patch(`${API_BASE_URL}/books/${book.id}/status`, { status: nextStatus });
      showToast(`Status updated to ${displayStatus}.`, 'success');
      // Snappy optimistic update
      setBooks((prev) => prev.map((b) => (b.id === book.id ? { ...b, status: nextStatus } : b)));
      fetchStats();
    } catch {
      showToast('Unable to connect to the server. Please try again.', 'error');
      fetchBooks();
    }
  };

  // 7. Delete Book
  const handleDeleteBook = async () => {
    if (!deletingBook) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/books/${deletingBook.id}`);
      showToast('Book deleted successfully.', 'success');
      setDeletingBook(null);
      if (searchQuery.trim()) {
        const res = await axios.get(`${API_BASE_URL}/books/search`, { params: { query: searchQuery.trim() } });
        setBooks(res.data);
      } else {
        fetchBooks();
      }
      fetchStats();
    } catch {
      showToast('Unable to delete book record.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Refresh All Data
  const handleRefresh = async () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setCurrentPage(1);
    await Promise.all([fetchBooks(true), fetchStats()]);
    showToast('Library data refreshed', 'info');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      
      {/* Top Navbar */}
      <header className="app-navbar" style={{ position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="sidebar-brand-icon" style={{ width: '38px', height: '38px' }}>
            <BookMarked size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', lineHeight: 1.2 }}>
              Library Book Management System
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              Librarian Portal & Collection Tracker
            </p>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="sidebar-badge" style={{ display: 'none', md: 'inline-flex' }}>
            <span className="sidebar-badge-dot"></span>
            <span>REST API Active</span>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh library records"
            style={{ padding: '8px 14px' }}
          >
            <RefreshCw size={15} className={refreshing ? 'spinner' : ''} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={() => openModal()}
            style={{ padding: '8px 18px' }}
          >
            <Plus size={16} />
            <span>+ Add New Book</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="page-container" style={{ padding: '32px 24px' }}>

        {/* Toast Alert */}
        {toast && (
          <div className="toast-container">
            <div className={`toast toast-${toast.type}`}>
              {toast.type === 'success' && <CheckCircle size={18} style={{ flexShrink: 0 }} />}
              {toast.type === 'error' && <AlertCircle size={18} style={{ flexShrink: 0 }} />}
              <span>{toast.message}</span>
              <button
                type="button"
                className="toast-close-btn"
                onClick={() => setToast(null)}
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Page Heading & Hero Info */}
        <div className="page-header">
          <div className="page-header-text">
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
              Library Overview & Statistics
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Manage your library collection efficiently. Track books, issue status, and categories in real-time.
            </p>
          </div>
        </div>

        {/* 4 Dashboard Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Total Books</span>
              <span className="stat-value">{statsLoading ? '...' : stats.totalBooks}</span>
            </div>
            <div className="stat-icon-wrapper stat-icon-total">
              <BookOpen size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Available Books</span>
              <span className="stat-value">{statsLoading ? '...' : stats.availableBooks}</span>
            </div>
            <div className="stat-icon-wrapper stat-icon-available">
              <CheckCircle size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Issued Books</span>
              <span className="stat-value">{statsLoading ? '...' : stats.issuedBooks}</span>
            </div>
            <div className="stat-icon-wrapper stat-icon-issued">
              <BookMinus size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Total Categories</span>
              <span className="stat-value">{statsLoading ? '...' : stats.totalCategories}</span>
            </div>
            <div className="stat-icon-wrapper stat-icon-categories">
              <Layers size={24} />
            </div>
          </div>
        </div>

        {/* Books Directory Card */}
        <div className="content-card">
          <div className="content-card-header" style={{ gap: '16px', flexWrap: 'wrap' }}>
            <div className="content-card-title">
              <BookOpen size={20} color="#1e3a8a" />
              <h3>Books Directory</h3>
              <span className="books-count-badge">
                {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
              </span>
            </div>

            {/* Search and Filters Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
              {/* Search Bar */}
              <div className="search-container">
                <Search className="search-icon" size={17} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => handleSearchChange('')}
                    title="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <select
                className="form-select"
                style={{ width: 'auto', padding: '9px 12px', fontSize: '13px' }}
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              >
                <option value="ALL">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                className="form-select"
                style={{ width: 'auto', padding: '9px 12px', fontSize: '13px' }}
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              >
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="ISSUED">Issued</option>
              </select>
            </div>
          </div>

          {/* Table / Empty State / Loading */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading books from database...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <BookOpen size={32} />
              </div>
              <h4>{searchQuery.trim() || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' ? 'No books found' : 'No books in library'}</h4>
              <p>
                {searchQuery.trim()
                  ? 'No matching book records found. Try a different title or author.'
                  : 'Start building your library collection by clicking "+ Add New Book".'}
              </p>
              {!searchQuery && selectedCategory === 'ALL' && selectedStatus === 'ALL' && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => openModal()}
                  style={{ marginTop: '10px' }}
                >
                  <Plus size={16} /> Add Your First Book
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="books-table">
                <thead>
                  <tr>
                    <th>Book ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBooks.map((b) => {
                    const isAvailable = b.status === 'AVAILABLE';
                    return (
                      <tr key={b.id}>
                        <td>
                          <span className="book-id-badge">{b.bookId}</span>
                        </td>
                        <td className="book-title-cell">
                          {b.title}
                        </td>
                        <td style={{ color: '#475569' }}>
                          {b.author}
                        </td>
                        <td>
                          <span className="book-category-tag">{b.category}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${isAvailable ? 'status-available' : 'status-issued'}`}>
                            <span className="status-badge-dot"></span>
                            {isAvailable ? 'Available' : 'Issued'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                            {/* Toggle Availability */}
                            <button
                              type="button"
                              className="action-btn action-btn-status"
                              onClick={() => handleToggleStatus(b)}
                              title={isAvailable ? 'Mark as Issued' : 'Mark as Available'}
                            >
                              <ArrowLeftRight size={13} />
                              <span>{isAvailable ? 'Issue' : 'Return'}</span>
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              className="action-btn action-btn-edit"
                              onClick={() => openModal(b)}
                              title="Edit book details"
                            >
                              <Edit2 size={13} />
                              <span>Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              className="action-btn action-btn-delete"
                              onClick={() => setDeletingBook(b)}
                              title="Delete book record"
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredBooks.length > itemsPerPage && (
            <div className="pagination-container">
              <div className="pagination-info">
                Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                <strong>{Math.min(currentPage * itemsPerPage, filteredBooks.length)}</strong> of{' '}
                <strong>{filteredBooks.length}</strong> books
              </div>
              <div className="pagination-controls">
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`pagination-btn ${currentPage === num ? 'active' : ''}`}
                    onClick={() => setCurrentPage(num)}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add / Edit Book Modal */}
        {isModalOpen && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingBook ? 'Edit Book Details' : 'Add New Book'}</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsModalOpen(false)}
                  disabled={formLoading}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveBook} noValidate>
                <div className="modal-body">
                  {formError && (
                    <div style={{ padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '13px', marginBottom: '16px', fontWeight: 500 }}>
                      {formError}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Book ID <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. BK101"
                      value={formData.bookId}
                      onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                      disabled={Boolean(editingBook) || formLoading}
                      autoFocus={!editingBook}
                    />
                    {editingBook && (
                      <p className="form-hint">Book ID is fixed and cannot be changed.</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Book Title <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Introduction to Algorithms"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      disabled={formLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Author Name <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Thomas H. Cormen"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      disabled={formLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category <span className="required">*</span></label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      disabled={formLoading}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Availability Status <span className="required">*</span></label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      disabled={formLoading}
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="ISSUED">Issued</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsModalOpen(false)}
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={formLoading}
                  >
                    <Check size={16} /> {formLoading ? 'Saving...' : editingBook ? 'Save Changes' : 'Add Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deletingBook && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal-content" style={{ maxWidth: '440px' }}>
              <div className="modal-header">
                <h3>Confirm Delete</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setDeletingBook(null)}
                  disabled={deleteLoading}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="modal-body">
                <div className="confirm-dialog-content">
                  <div className="confirm-dialog-icon">
                    <AlertCircle size={30} />
                  </div>
                  <h4 className="confirm-dialog-title">Delete Book Record</h4>
                  <div className="confirm-dialog-book">
                    "{deletingBook.title}"
                  </div>
                  <p className="confirm-dialog-msg">
                    Are you sure you want to delete this book? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setDeletingBook(null)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={handleDeleteBook}
                  disabled={deleteLoading}
                >
                  <Trash2 size={16} /> {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
