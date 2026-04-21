package com.expensetracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

public class AnalyticsDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SummaryResponse {
        private int month;
        private int year;
        private BigDecimal totalExpenses;
        private BigDecimal budgetLimit;
        private boolean budgetExceeded;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryResponse {
        private int month;
        private int year;
        private Map<String, BigDecimal> categoryTotals;
    }
}
