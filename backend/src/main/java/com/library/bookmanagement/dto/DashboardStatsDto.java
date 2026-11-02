package com.library.bookmanagement.dto;

public class DashboardStatsDto {

    private long totalBooks;
    private long availableBooks;
    private long issuedBooks;
    private long totalCategories;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalBooks, long availableBooks, long issuedBooks, long totalCategories) {
        this.totalBooks = totalBooks;
        this.availableBooks = availableBooks;
        this.issuedBooks = issuedBooks;
        this.totalCategories = totalCategories;
    }

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getAvailableBooks() {
        return availableBooks;
    }

    public void setAvailableBooks(long availableBooks) {
        this.availableBooks = availableBooks;
    }

    public long getIssuedBooks() {
        return issuedBooks;
    }

    public void setIssuedBooks(long issuedBooks) {
        this.issuedBooks = issuedBooks;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }
}

