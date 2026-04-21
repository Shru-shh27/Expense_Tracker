package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.AnalyticsDto;
import com.expensetracker.backend.model.Budget;
import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.repository.BudgetRepository;
import com.expensetracker.backend.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    public AnalyticsDto.SummaryResponse getSummary(String userId, int month, int year) {
        List<Expense> expenses = expenseRepository.findByUserId(userId).stream()
                .filter(e -> e.getDate().getMonthValue() == month && e.getDate().getYear() == year)
                .collect(Collectors.toList());

        BigDecimal totalExpenses = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Optional<Budget> budgetOpt = budgetRepository.findByUserIdAndMonthAndYear(userId, month, year);
        BigDecimal budgetLimit = budgetOpt.map(Budget::getLimitAmount).orElse(BigDecimal.ZERO);
        
        boolean budgetExceeded = budgetLimit.compareTo(BigDecimal.ZERO) > 0 && totalExpenses.compareTo(budgetLimit) > 0;

        return new AnalyticsDto.SummaryResponse(month, year, totalExpenses, budgetLimit, budgetExceeded);
    }

    public AnalyticsDto.CategoryResponse getCategoryBreakdown(String userId, int month, int year) {
        List<Expense> expenses = expenseRepository.findByUserId(userId).stream()
                .filter(e -> e.getDate().getMonthValue() == month && e.getDate().getYear() == year)
                .collect(Collectors.toList());

        Map<String, BigDecimal> categoryTotals = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.mapping(
                                Expense::getAmount,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                        )
                ));

        return new AnalyticsDto.CategoryResponse(month, year, categoryTotals);
    }
}
