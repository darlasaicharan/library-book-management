import React, { useState, useMemo } from 'react';
import { Plus, BookOpen, Layers } from 'lucide-react';
import DashboardCards from '../components/DashboardCards';
import SearchBar from '../components/SearchBar';
import BookTable from '../components/BookTable';
import Pagination from '../components/Pagination';

const Dashboard = ({
  stats,
  statsLoading,
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Paginated books
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return books.slice(startIndex, startIndex + itemsPerPage);
  }, [books, currentPage, itemsPerPage]);

  return (
    <div className="page-container">
      {/* Page Heading & Subtitle */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Library Book Management System</h1>
          <p>Manage your library collection efficiently.</p>
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

      {/* Dynamic Statistics Cards */}
      <DashboardCards stats={stats} loading={statsLoading} />

      {/* Books Table Card */}
      <div className="content-card">
        <div className="content-card-header">
          <div className="content-card-title">
            <BookOpen size={20} color="#1e3a8a" />
            <h3>Books Directory</h3>
            <span className="books-count-badge">
              {books.length} {books.length === 1 ? 'book' : 'books'}
            </span>
          </div>

          {/* Search bar */}
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onClearSearch}
            placeholder="Search by title or author name..."
          />
        </div>

        {/* Book Records Table */}
        <BookTable
          books={paginatedBooks}
          loading={booksLoading}
          error={booksError}
          onEdit={onEditBook}
          onDelete={onDeleteBook}
          onToggleStatus={onToggleStatus}
          actionLoadingId={actionLoadingId}
          isSearching={Boolean(searchQuery.trim())}
          onAddNewClick={onAddNewBook}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={books.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Dashboard;

