import React from 'react';
import { Edit2, Trash2, ArrowLeftRight, BookOpen, AlertCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';

const BookTable = ({
  books,
  loading,
  error,
  onEdit,
  onDelete,
  onToggleStatus,
  actionLoadingId,
  isSearching = false,
  onAddNewClick
}) => {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading books from database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
          <AlertCircle size={32} />
        </div>
        <h4>Unable to Load Books</h4>
        <p>{error}</p>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <BookOpen size={32} />
        </div>
        {isSearching ? (
          <>
            <h4>No books found</h4>
            <p>No matching books found for your search query. Try searching with a different title or author.</p>
          </>
        ) : (
          <>
            <h4>No books in collection</h4>
            <p>Your library is currently empty. Start building your collection by adding the first book.</p>
            {onAddNewClick && (
              <button
                type="button"
                className="btn-primary"
                onClick={onAddNewClick}
              >
                + Add New Book
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  return (
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
          {books.map((book) => {
            const isToggling = actionLoadingId === book.id;
            const isAvailable = book.status === 'AVAILABLE';

            return (
              <tr key={book.id}>
                <td>
                  <span className="book-id-badge">{book.bookId}</span>
                </td>
                <td className="book-title-cell">{book.title}</td>
                <td>{book.author}</td>
                <td>
                  <span className="book-category-tag">{book.category}</span>
                </td>
                <td>
                  <StatusBadge status={book.status} />
                </td>
                <td>
                  <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                    {/* Availability toggle */}
                    <button
                      type="button"
                      className="action-btn action-btn-status"
                      onClick={() => onToggleStatus(book)}
                      disabled={isToggling}
                      title={isAvailable ? 'Mark as Issued' : 'Mark as Available'}
                    >
                      <ArrowLeftRight size={14} />
                      {isToggling ? 'Updating...' : isAvailable ? 'Issue' : 'Return'}
                    </button>

                    {/* Edit button */}
                    <button
                      type="button"
                      className="action-btn action-btn-edit"
                      onClick={() => onEdit(book)}
                      title="Edit book details"
                    >
                      <Edit2 size={14} /> Edit
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      className="action-btn action-btn-delete"
                      onClick={() => onDelete(book)}
                      title="Delete book record"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;

