package com.library.bookmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class BookUpdateRequestDto {

    // Book ID is optional on update and remains fixed in database
    private String bookId;

    @NotBlank(message = "Please enter the book title.")
    @Size(max = 255, message = "Title must not exceed 255 characters.")
    private String title;

    @NotBlank(message = "Please enter the author name.")
    @Size(max = 150, message = "Author name must not exceed 150 characters.")
    private String author;

    @NotBlank(message = "Please select a category.")
    @Size(max = 100, message = "Category must not exceed 100 characters.")
    private String category;

    @NotBlank(message = "Please select an availability status.")
    @Pattern(regexp = "^(?i)(AVAILABLE|ISSUED)$", message = "Status must be either 'AVAILABLE' or 'ISSUED'.")
    private String status;

    public BookUpdateRequestDto() {
    }

    public BookUpdateRequestDto(String bookId, String title, String author, String category, String status) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.category = category;
        this.status = status;
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

