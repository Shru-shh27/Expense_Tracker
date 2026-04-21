package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.BudgetDto;
import com.expensetracker.backend.model.Budget;
import com.expensetracker.backend.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    public BudgetDto.Response setBudget(BudgetDto.Request request, String userId) {
        Optional<Budget> existing = budgetRepository.findByUserIdAndMonthAndYear(userId, request.getMonth(), request.getYear());
        
        Budget budget;
        if (existing.isPresent()) {
            budget = existing.get();
            budget.setLimitAmount(request.getLimitAmount());
        } else {
            budget = new Budget();
            budget.setUserId(userId);
            budget.setLimitAmount(request.getLimitAmount());
            budget.setMonth(request.getMonth());
            budget.setYear(request.getYear());
        }

        Budget saved = budgetRepository.save(budget);
        
        BudgetDto.Response response = new BudgetDto.Response();
        response.setId(saved.getId());
        response.setLimitAmount(saved.getLimitAmount());
        response.setMonth(saved.getMonth());
        response.setYear(saved.getYear());
        response.setMessage(existing.isPresent() ? "Budget updated successfully" : "Budget created successfully");
        
        return response;
    }

    public BudgetDto.Response getBudget(String userId, int month, int year) {
        Budget budget = budgetRepository.findByUserIdAndMonthAndYear(userId, month, year)
                .orElse(null);
                
        if (budget == null) {
            return null; // Controller can handle 404 or default response
        }

        BudgetDto.Response response = new BudgetDto.Response();
        response.setId(budget.getId());
        response.setLimitAmount(budget.getLimitAmount());
        response.setMonth(budget.getMonth());
        response.setYear(budget.getYear());
        response.setMessage("Budget retrieved successfully");
        
        return response;
    }
}
