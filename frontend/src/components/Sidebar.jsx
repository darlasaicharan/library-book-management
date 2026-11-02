import React from 'react';
import { BookOpen, LayoutDashboard, Library, BookMarked } from 'lucide-react';

const Sidebar = ({ activeTab, onSelectTab, isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose}></div>}

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand-icon">
            <BookMarked size={22} />
          </div>
          <div className="sidebar-brand-text">
            <h1>Library Admin</h1>
            <p>Book Management System</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              onSelectTab('dashboard');
              if (onClose) onClose();
            }}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`nav-link ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => {
              onSelectTab('books');
              if (onClose) onClose();
            }}
          >
            <Library size={18} />
            <span>Books Collection</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-badge">
            <span className="sidebar-badge-dot"></span>
            <span>REST API Active</span>
          </div>
          <p style={{ marginTop: '6px' }}>Spring Boot & MySQL 8</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

