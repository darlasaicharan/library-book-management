package com.library.bookmanagement.repository;

import com.library.bookmanagement.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    /**
     * Check if a book with the given bookId already exists.
     */
    boolean existsByBookId(String bookId);

    /**
     * Find a book by unique bookId.
     */
    Optional<Book> findByBookId(String bookId);

    /**
     * Search books by title or author name (case-insensitive substring match).
     */
    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY b.id DESC")
    List<Book> searchByTitleOrAuthor(@Param("keyword") String keyword);

    /**
     * Count books by availability status (e.g. AVAILABLE, ISSUED).
     */
    long countByStatus(String status);

    /**
     * Count the total number of distinct categories in the database.
     */
    @Query("SELECT COUNT(DISTINCT b.category) FROM Book b")
    long countDistinctCategories();

    /**
     * Find all books sorted by ID descending.
     */
    List<Book> findAllByOrderByIdDesc();
}

