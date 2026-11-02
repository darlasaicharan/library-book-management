package com.library.bookmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class StatusUpdateRequestDto {

    @NotBlank(message = "Status cannot be blank.")
    @Pattern(regexp = "^(?i)(AVAILABLE|ISSUED)$", message = "Status must be either 'AVAILABLE' or 'ISSUED'.")
    private String status;

    public StatusUpdateRequestDto() {
    }

    public StatusUpdateRequestDto(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

