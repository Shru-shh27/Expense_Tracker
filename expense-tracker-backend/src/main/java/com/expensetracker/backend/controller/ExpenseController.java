package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.ExpenseDto;
import com.expensetracker.backend.security.services.UserDetailsImpl;
import com.expensetracker.backend.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseDto.Response> createExpense(
            @Valid @RequestBody ExpenseDto.Request request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        ExpenseDto.Response response = expenseService.addExpense(request, userDetails.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDto.Response>> getAllExpenses(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<ExpenseDto.Response> expenses = expenseService.getExpensesForUser(userDetails.getId());
        return ResponseEntity.ok(expenses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDto.Response> updateExpense(
            @PathVariable String id,
            @Valid @RequestBody ExpenseDto.Request request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        ExpenseDto.Response response = expenseService.updateExpense(id, request, userDetails.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        expenseService.deleteExpense(id, userDetails.getId());
        return ResponseEntity.ok().build();
    }
}
