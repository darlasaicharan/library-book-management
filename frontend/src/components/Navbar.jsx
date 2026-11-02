import React from 'react';
import { Menu, Plus, RefreshCw } from 'lucide-react';

const Navbar = ({ onToggleSidebar, onAddNewBook, onRefresh, refreshing, activeTab }) => {
  return (
    <header className="app-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <div className="navbar-page-title">
          <h2>{activeTab === 'dashboard' ? 'Overview Dashboard' : 'Books Management'}</h2>
          <p>Librarian Portal & Collection Tracker</p>
        </div>
      </div>

      <div className="navbar-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onRefresh}
          disabled={refreshing}
          title="Refresh library data"
          style={{ padding: '8px 14px' }}
        >
          <RefreshCw size={15} className={refreshing ? 'spinner' : ''} />
          <span className="hide-on-mobile">Refresh</span>
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={onAddNewBook}
          style={{ padding: '8px 16px' }}
        >
          <Plus size={16} />
          <span>+ Add New Book</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;

