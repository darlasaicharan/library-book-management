package com.library.bookmanagement.exception;

public class DuplicateBookIdException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public DuplicateBookIdException(String message) {
        super(message);
    }
}

