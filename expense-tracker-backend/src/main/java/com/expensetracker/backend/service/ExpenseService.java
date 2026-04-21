package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.ExpenseDto;
import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public ExpenseDto.Response addExpense(ExpenseDto.Request request, String userId) {
        Expense expense = new Expense();
        expense.setUserId(userId);
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());

        Expense saved = expenseRepository.save(expense);
        return mapToResponse(saved);
    }

    public List<ExpenseDto.Response> getExpensesForUser(String userId) {
        return expenseRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ExpenseDto.Response updateExpense(String id, ExpenseDto.Request request, String userId) {
        Expense expense = expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found or not authorized"));

        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());

        return mapToResponse(expenseRepository.save(expense));
    }

    public void deleteExpense(String id, String userId) {
        Expense expense = expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found or not authorized"));
        expenseRepository.delete(expense);
    }

    private ExpenseDto.Response mapToResponse(Expense expense) {
        ExpenseDto.Response response = new ExpenseDto.Response();
        response.setId(expense.getId());
        response.setDescription(expense.getDescription());
        response.setAmount(expense.getAmount());
        response.setCategory(expense.getCategory());
        response.setDate(expense.getDate());
        return response;
    }
}
