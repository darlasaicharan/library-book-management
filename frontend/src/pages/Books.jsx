import React, { useState, useMemo } from 'react';
import { Plus, Library, Filter } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import BookTable from '../components/BookTable';
import Pagination from '../components/Pagination';

const Books = ({
  books,
  booksLoading,
  booksError,
  searchQuery,
  onSearchChange,
  onClearSearch,
  onAddNewBook,
  onEditBook,
  onDeleteBook,
  onToggleStatus,
  actionLoadingId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter books by category and status
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchCategory =
        selectedCategory === 'ALL' || book.category === selectedCategory;
      const matchStatus =
        selectedStatus === 'ALL' || book.status === selectedStatus;
      return matchCategory && matchStatus;
    });
  }, [books, selectedCategory, selectedStatus]);

  // Extract unique categories from current books
  const categories = useMemo(() => {
    const set = new Set(books.map((b) => b.category));
    return Array.from(set).filter(Boolean);
  }, [books]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus]);

  // Paginated books
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBooks, currentPage, itemsPerPage]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Books Collection</h1>
          <p>Browse, filter, edit, and maintain all books in the library catalog.</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={onAddNewBook}
        >
          <Plus size={18} />
          <span>+ Add New Book</span>
        </button>
      </div>

      <div className="content-card">
        <div className="content-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              onClear={onClearSearch}
              placeholder="Search by title or author..."
            />

            {/* Category Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', padding: '9px 12px', fontSize: '13px' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', padding: '9px 12px', fontSize: '13px' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="ISSUED">Issued</option>
            </select>
          </div>

          <span className="books-count-badge">
            {filteredBooks.length} results
          </span>
        </div>

        <BookTable
          books={paginatedBooks}
          loading={booksLoading}
          error={booksError}
          onEdit={onEditBook}
          onDelete={onDeleteBook}
          onToggleStatus={onToggleStatus}
          actionLoadingId={actionLoadingId}
          isSearching={Boolean(searchQuery.trim() || selectedCategory !== 'ALL' || selectedStatus !== 'ALL')}
          onAddNewClick={onAddNewBook}
        />

        <Pagination
          currentPage={currentPage}
          totalItems={filteredBooks.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Books;

