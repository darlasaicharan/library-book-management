package com.library.bookmanagement.dto;

import com.library.bookmanagement.entity.Book;

public class BookResponseDto {

    private Long id;
    private String bookId;
    private String title;
    private String author;
    private String category;
    private String status;

    public BookResponseDto() {
    }

    public BookResponseDto(Long id, String bookId, String title, String author, String category, String status) {
        this.id = id;
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.category = category;
        this.status = status;
    }

    public static BookResponseDto fromEntity(Book book) {
        if (book == null) {
            return null;
        }
        return new BookResponseDto(
                book.getId(),
                book.getBookId(),
                book.getTitle(),
                book.getAuthor(),
                book.getCategory(),
                book.getStatus()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

