package com.expensetracker.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@Document(collection = "budgets")
public class Budget {
    @Id
    private String id;
    private String userId;
    private BigDecimal limitAmount;
    private int month;
    private int year;
}
