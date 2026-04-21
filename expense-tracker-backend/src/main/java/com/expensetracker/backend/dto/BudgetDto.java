package com.expensetracker.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

public class BudgetDto {

    @Data
    public static class Request {
        @NotNull(message = "Limit amount is required")
        @DecimalMin(value = "1.00", message = "Limit must be valid")
        private BigDecimal limitAmount;

        @Min(1) @Max(12)
        private int month;

        @Min(2000)
        private int year;
    }

    @Data
    public static class Response {
        private String id;
        private BigDecimal limitAmount;
        private int month;
        private int year;
        private String message;
    }
}
