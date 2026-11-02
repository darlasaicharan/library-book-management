package com.library.bookmanagement.service;

import com.library.bookmanagement.dto.BookRequestDto;
import com.library.bookmanagement.dto.BookResponseDto;
import com.library.bookmanagement.dto.BookUpdateRequestDto;
import com.library.bookmanagement.dto.DashboardStatsDto;

import java.util.List;

public interface BookService {

    /**
     * Create a new book record.
     */
    BookResponseDto addBook(BookRequestDto requestDto);

    /**
     * Retrieve all books.
     */
    List<BookResponseDto> getAllBooks();

    /**
     * Retrieve a specific book by its database ID.
     */
    BookResponseDto getBookById(Long id);

    /**
     * Update an existing book's details. Keeps Book ID fixed.
     */
    BookResponseDto updateBook(Long id, BookUpdateRequestDto requestDto);

    /**
     * Delete an existing book by its database ID.
     */
    void deleteBook(Long id);

    /**
     * Search books by title or author name (case-insensitive).
     */
    List<BookResponseDto> searchBooks(String query);

    /**
     * Switch or update the availability status (AVAILABLE or ISSUED).
     */
    BookResponseDto updateBookStatus(Long id, String status);

    /**
     * Calculate and return dynamic library dashboard statistics.
     */
    DashboardStatsDto getDashboardStats();
}

