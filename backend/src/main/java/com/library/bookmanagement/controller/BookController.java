package com.library.bookmanagement.controller;

import com.library.bookmanagement.dto.BookRequestDto;
import com.library.bookmanagement.dto.BookResponseDto;
import com.library.bookmanagement.dto.BookUpdateRequestDto;
import com.library.bookmanagement.dto.DashboardStatsDto;
import com.library.bookmanagement.dto.StatusUpdateRequestDto;
import com.library.bookmanagement.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(
    origins = "*",
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS}
)
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    /**
     * POST /api/books
     * Create a new book.
     */
    @PostMapping
    public ResponseEntity<BookResponseDto> addBook(@Valid @RequestBody BookRequestDto requestDto) {
        BookResponseDto createdBook = bookService.addBook(requestDto);
        return new ResponseEntity<>(createdBook, HttpStatus.CREATED);
    }

    /**
     * GET /api/books
     * Retrieve all book records.
     */
    @GetMapping
    public ResponseEntity<List<BookResponseDto>> getAllBooks() {
        List<BookResponseDto> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }

    /**
     * GET /api/books/{id}
     * Retrieve a specific book using its database ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDto> getBookById(@PathVariable Long id) {
        BookResponseDto book = bookService.getBookById(id);
        return ResponseEntity.ok(book);
    }

    /**
     * PUT /api/books/{id}
     * Update an existing book's details (Title, Author, Category, Status).
     */
    @PutMapping("/{id}")
    public ResponseEntity<BookResponseDto> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookUpdateRequestDto requestDto
    ) {
        BookResponseDto updatedBook = bookService.updateBook(id, requestDto);
        return ResponseEntity.ok(updatedBook);
    }

    /**
     * DELETE /api/books/{id}
     * Delete an existing book.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/books/search?query={keyword}
     * Search by title or author name.
     */
    @GetMapping("/search")
    public ResponseEntity<List<BookResponseDto>> searchBooks(@RequestParam(value = "query", required = false, defaultValue = "") String query) {
        List<BookResponseDto> results = bookService.searchBooks(query);
        return ResponseEntity.ok(results);
    }

    /**
     * PATCH /api/books/{id}/status
     * Change availability status between AVAILABLE and ISSUED.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<BookResponseDto> updateBookStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequestDto requestDto
    ) {
        BookResponseDto updatedBook = bookService.updateBookStatus(id, requestDto.getStatus());
        return ResponseEntity.ok(updatedBook);
    }

    /**
     * GET /api/books/stats
     * Return dynamic library dashboard statistics.
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        DashboardStatsDto stats = bookService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}

