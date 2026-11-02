import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'Technology',
  'History',
  'Mathematics',
  'Literature',
  'Biography',
  'Other',
];

const BookForm = ({ isOpen, onClose, onSubmit, initialData = null, isEdit = false, loading = false, serverError = null }) => {
  const [formData, setFormData] = useState({
    bookId: '',
    title: '',
    author: '',
    category: '',
    status: 'AVAILABLE',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        bookId: initialData.bookId || '',
        title: initialData.title || '',
        author: initialData.author || '',
        category: initialData.category || '',
        status: initialData.status || 'AVAILABLE',
      });
    } else {
      setFormData({
        bookId: '',
        title: '',
        author: '',
        category: '',
        status: 'AVAILABLE',
      });
    }
    setErrors({});
  }, [initialData, isEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!isEdit && !formData.bookId.trim()) {
      newErrors.bookId = 'Please enter a Book ID.';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter the book title.';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Please enter the author name.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category.';
    }

    if (!formData.status) {
      newErrors.status = 'Please select an availability status.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    onSubmit({
      ...formData,
      bookId: formData.bookId.trim(),
      title: formData.title.trim(),
      author: formData.author.trim(),
    });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Book Details' : 'Add New Book'}</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {serverError && (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '13px',
                  marginBottom: '16px',
                  fontWeight: 500,
                }}
              >
                {serverError}
              </div>
            )}

            {/* Book ID Field */}
            <div className="form-group">
              <label htmlFor="bookId" className="form-label">
                Book ID <span className="required">*</span>
              </label>
              <input
                id="bookId"
                type="text"
                className={`form-input ${errors.bookId ? 'input-error' : ''}`}
                placeholder="e.g. BK101"
                value={formData.bookId}
                onChange={(e) => handleChange('bookId', e.target.value)}
                disabled={isEdit || loading}
                autoFocus={!isEdit}
              />
              {isEdit && (
                <p className="form-hint">
                  Book ID is fixed and cannot be changed.
                </p>
              )}
              {errors.bookId && (
                <span className="form-error-msg">{errors.bookId}</span>
              )}
            </div>

            {/* Book Title Field */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Book Title <span className="required">*</span>
              </label>
              <input
                id="title"
                type="text"
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                placeholder="e.g. Introduction to Algorithms"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                disabled={loading}
              />
              {errors.title && (
                <span className="form-error-msg">{errors.title}</span>
              )}
            </div>

            {/* Author Name Field */}
            <div className="form-group">
              <label htmlFor="author" className="form-label">
                Author Name <span className="required">*</span>
              </label>
              <input
                id="author"
                type="text"
                className={`form-input ${errors.author ? 'input-error' : ''}`}
                placeholder="e.g. Thomas H. Cormen"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                disabled={loading}
              />
              {errors.author && (
                <span className="form-error-msg">{errors.author}</span>
              )}
            </div>

            {/* Category Field */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                className={`form-select ${errors.category ? 'input-error' : ''}`}
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                disabled={loading}
              >
                <option value="">-- Select a Category --</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="form-error-msg">{errors.category}</span>
              )}
            </div>

            {/* Availability Status Field */}
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Availability Status <span className="required">*</span>
              </label>
              <select
                id="status"
                className={`form-select ${errors.status ? 'input-error' : ''}`}
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                disabled={loading}
              >
                <option value="AVAILABLE">Available</option>
                <option value="ISSUED">Issued</option>
              </select>
              {errors.status && (
                <span className="form-error-msg">{errors.status}</span>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                'Saving...'
              ) : (
                <>
                  <Check size={16} /> {isEdit ? 'Save Changes' : 'Add Book'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;

