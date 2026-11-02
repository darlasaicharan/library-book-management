import api from './api';

export const bookService = {
  /**
   * Retrieve all books from backend
   */
  async getAllBooks() {
    const response = await api.get('/books');
    return response.data;
  },

  /**
   * Retrieve single book by database ID
   */
  async getBookById(id) {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  /**
   * Add a new book
   */
  async addBook(bookData) {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  /**
   * Update existing book details
   */
  async updateBook(id, bookData) {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  /**
   * Delete a book record
   */
  async deleteBook(id) {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  /**
   * Search books by keyword (title or author)
   */
  async searchBooks(query) {
    const trimmed = (query || '').trim();
    const response = await api.get('/books/search', {
      params: { query: trimmed }
    });
    return response.data;
  },

  /**
   * Switch or change book availability status
   */
  async updateBookStatus(id, status) {
    const response = await api.patch(`/books/${id}/status`, { status });
    return response.data;
  },

  /**
   * Retrieve dynamic dashboard statistics
   */
  async getDashboardStats() {
    const response = await api.get('/books/stats');
    return response.data;
  }
};

export default bookService;

