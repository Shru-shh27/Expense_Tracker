package com.expensetracker.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseDto {

    @Data
    public static class Request {
        @NotBlank(message = "Description cannot be empty")
        private String description;

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        private BigDecimal amount;

        @NotBlank(message = "Category is required")
        private String category;

        @NotNull(message = "Date is required")
        private LocalDate date;
    }

    @Data
    public static class Response {
        private String id;
        private String description;
        private BigDecimal amount;
        private String category;
        private LocalDate date;
    }
}
