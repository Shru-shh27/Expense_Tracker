package com.expensetracker.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@Document(collection = "expenses")
public class Expense {
    @Id
    private String id;
    private String userId;
    private String description;
    private BigDecimal amount;
    private String category;
    private LocalDate date;
}
