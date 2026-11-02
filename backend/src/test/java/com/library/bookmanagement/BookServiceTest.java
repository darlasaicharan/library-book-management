package com.library.bookmanagement;

import com.library.bookmanagement.dto.BookRequestDto;
import com.library.bookmanagement.dto.BookResponseDto;
import com.library.bookmanagement.dto.BookUpdateRequestDto;
import com.library.bookmanagement.dto.DashboardStatsDto;
import com.library.bookmanagement.entity.Book;
import com.library.bookmanagement.exception.DuplicateBookIdException;
import com.library.bookmanagement.exception.ResourceNotFoundException;
import com.library.bookmanagement.repository.BookRepository;
import com.library.bookmanagement.service.impl.BookServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookServiceImpl bookService;

    private Book sampleBook;

    @BeforeEach
    void setUp() {
        sampleBook = new Book(1L, "BK101", "Wings of Fire", "A.P.J. Abdul Kalam", "Biography", "AVAILABLE");
    }

    @Test
    @DisplayName("Should successfully add a book when Book ID is unique")
    void testAddBookSuccess() {
        BookRequestDto request = new BookRequestDto("BK101", "Wings of Fire", "A.P.J. Abdul Kalam", "Biography", "AVAILABLE");
        when(bookRepository.existsByBookId("BK101")).thenReturn(false);
        when(bookRepository.save(any(Book.class))).thenReturn(sampleBook);

        BookResponseDto response = bookService.addBook(request);

        assertNotNull(response);
        assertEquals("BK101", response.getBookId());
        assertEquals("Wings of Fire", response.getTitle());
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    @DisplayName("Should throw DuplicateBookIdException when Book ID already exists")
    void testAddBookDuplicateId() {
        BookRequestDto request = new BookRequestDto("BK101", "Another Book", "Author", "Fiction", "AVAILABLE");
        when(bookRepository.existsByBookId("BK101")).thenReturn(true);

        DuplicateBookIdException ex = assertThrows(DuplicateBookIdException.class, () -> bookService.addBook(request));
        assertEquals("A book with this ID already exists.", ex.getMessage());
        verify(bookRepository, never()).save(any(Book.class));
    }

    @Test
    @DisplayName("Should retrieve all books ordered by ID descending")
    void testGetAllBooks() {
        Book secondBook = new Book(2L, "BK102", "The Alchemist", "Paulo Coelho", "Fiction", "ISSUED");
        when(bookRepository.findAllByOrderByIdDesc()).thenReturn(Arrays.asList(secondBook, sampleBook));

        List<BookResponseDto> list = bookService.getAllBooks();

        assertEquals(2, list.size());
        assertEquals("BK102", list.get(0).getBookId());
        assertEquals("BK101", list.get(1).getBookId());
    }

    @Test
    @DisplayName("Should retrieve book by ID successfully")
    void testGetBookByIdSuccess() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(sampleBook));

        BookResponseDto response = bookService.getBookById(1L);

        assertNotNull(response);
        assertEquals("BK101", response.getBookId());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when book not found")
    void testGetBookByIdNotFound() {
        when(bookRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> bookService.getBookById(99L));
    }

    @Test
    @DisplayName("Should update book details while keeping Book ID fixed")
    void testUpdateBook() {
        BookUpdateRequestDto updateDto = new BookUpdateRequestDto("IGNORED_ID", "Updated Title", "Updated Author", "Science", "ISSUED");
        when(bookRepository.findById(1L)).thenReturn(Optional.of(sampleBook));
        when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookResponseDto result = bookService.updateBook(1L, updateDto);

        assertEquals("BK101", result.getBookId()); // Fixed!
        assertEquals("Updated Title", result.getTitle());
        assertEquals("Updated Author", result.getAuthor());
        assertEquals("Science", result.getCategory());
        assertEquals("ISSUED", result.getStatus());
    }

    @Test
    @DisplayName("Should delete book successfully")
    void testDeleteBook() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(sampleBook));
        doNothing().when(bookRepository).delete(sampleBook);

        assertDoesNotThrow(() -> bookService.deleteBook(1L));
        verify(bookRepository, times(1)).delete(sampleBook);
    }

    @Test
    @DisplayName("Should update availability status")
    void testUpdateBookStatus() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(sampleBook));
        when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookResponseDto result = bookService.updateBookStatus(1L, "ISSUED");

        assertEquals("ISSUED", result.getStatus());
    }

    @Test
    @DisplayName("Should calculate dynamic dashboard statistics")
    void testGetDashboardStats() {
        when(bookRepository.count()).thenReturn(10L);
        when(bookRepository.countByStatus("AVAILABLE")).thenReturn(7L);
        when(bookRepository.countByStatus("ISSUED")).thenReturn(3L);
        when(bookRepository.countDistinctCategories()).thenReturn(4L);

        DashboardStatsDto stats = bookService.getDashboardStats();

        assertEquals(10L, stats.getTotalBooks());
        assertEquals(7L, stats.getAvailableBooks());
        assertEquals(3L, stats.getIssuedBooks());
        assertEquals(4L, stats.getTotalCategories());
    }
}

