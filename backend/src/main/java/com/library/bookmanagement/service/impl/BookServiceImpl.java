package com.library.bookmanagement.service.impl;

import com.library.bookmanagement.dto.BookRequestDto;
import com.library.bookmanagement.dto.BookResponseDto;
import com.library.bookmanagement.dto.BookUpdateRequestDto;
import com.library.bookmanagement.dto.DashboardStatsDto;
import com.library.bookmanagement.entity.Book;
import com.library.bookmanagement.exception.DuplicateBookIdException;
import com.library.bookmanagement.exception.InvalidInputException;
import com.library.bookmanagement.exception.ResourceNotFoundException;
import com.library.bookmanagement.repository.BookRepository;
import com.library.bookmanagement.service.BookService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

// Implementation of library book management business logic
@Service
@Transactional
@SuppressWarnings("null")
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public BookResponseDto addBook(BookRequestDto requestDto) {
        if (requestDto == null) {
            throw new InvalidInputException("Book data must not be empty.");
        }

        String bookId = sanitize(requestDto.getBookId());
        String title = sanitize(requestDto.getTitle());
        String author = sanitize(requestDto.getAuthor());
        String category = sanitize(requestDto.getCategory());
        String status = sanitize(requestDto.getStatus());

        if (bookId.isEmpty()) {
            throw new InvalidInputException("Please enter a Book ID.");
        }
        if (title.isEmpty()) {
            throw new InvalidInputException("Please enter the book title.");
        }
        if (author.isEmpty()) {
            throw new InvalidInputException("Please enter the author name.");
        }
        if (category.isEmpty()) {
            throw new InvalidInputException("Please select a category.");
        }
        validateStatus(status);

        // Check for duplicate Book ID
        if (bookRepository.existsByBookId(bookId)) {
            throw new DuplicateBookIdException("A book with this ID already exists.");
        }

        Book book = new Book();
        book.setBookId(bookId);
        book.setTitle(title);
        book.setAuthor(author);
        book.setCategory(category);
        book.setStatus(status.toUpperCase());

        Book savedBook = bookRepository.save(Objects.requireNonNull(book));
        return BookResponseDto.fromEntity(savedBook);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDto> getAllBooks() {
        return bookRepository.findAllByOrderByIdDesc()
                .stream()
                .map(BookResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookResponseDto getBookById(Long id) {
        Book book = bookRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return BookResponseDto.fromEntity(book);
    }

    @Override
    public BookResponseDto updateBook(Long id, BookUpdateRequestDto requestDto) {
        if (requestDto == null) {
            throw new InvalidInputException("Update data must not be empty.");
        }

        Book existingBook = bookRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        String title = sanitize(requestDto.getTitle());
        String author = sanitize(requestDto.getAuthor());
        String category = sanitize(requestDto.getCategory());
        String status = sanitize(requestDto.getStatus());

        if (title.isEmpty()) {
            throw new InvalidInputException("Please enter the book title.");
        }
        if (author.isEmpty()) {
            throw new InvalidInputException("Please enter the author name.");
        }
        if (category.isEmpty()) {
            throw new InvalidInputException("Please select a category.");
        }
        validateStatus(status);

        // Keep Book ID fixed to prevent accidental identity changes
        existingBook.setTitle(title);
        existingBook.setAuthor(author);
        existingBook.setCategory(category);
        existingBook.setStatus(status.toUpperCase());

        Book updatedBook = bookRepository.save(Objects.requireNonNull(existingBook));
        return BookResponseDto.fromEntity(updatedBook);
    }

    @Override
    public void deleteBook(Long id) {
        Book existingBook = bookRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        bookRepository.delete(Objects.requireNonNull(existingBook));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDto> searchBooks(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllBooks();
        }
        String keyword = query.trim();
        return bookRepository.searchByTitleOrAuthor(keyword)
                .stream()
                .map(BookResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public BookResponseDto updateBookStatus(Long id, String status) {
        Book existingBook = bookRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        String sanitizedStatus = sanitize(status);
        validateStatus(sanitizedStatus);

        existingBook.setStatus(sanitizedStatus.toUpperCase());
        Book updatedBook = bookRepository.save(Objects.requireNonNull(existingBook));
        return BookResponseDto.fromEntity(updatedBook);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        long totalBooks = bookRepository.count();
        long availableBooks = bookRepository.countByStatus("AVAILABLE");
        long issuedBooks = bookRepository.countByStatus("ISSUED");
        long totalCategories = bookRepository.countDistinctCategories();

        return new DashboardStatsDto(totalBooks, availableBooks, issuedBooks, totalCategories);
    }

    private String sanitize(String input) {
        return input == null ? "" : input.trim();
    }

    private void validateStatus(String status) {
        if (status == null || (!status.equalsIgnoreCase("AVAILABLE") && !status.equalsIgnoreCase("ISSUED"))) {
            throw new InvalidInputException("Status must be either 'AVAILABLE' or 'ISSUED'.");
        }
    }
}

