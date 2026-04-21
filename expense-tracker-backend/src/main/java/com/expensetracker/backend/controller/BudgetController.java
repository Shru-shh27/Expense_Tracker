package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.BudgetDto;
import com.expensetracker.backend.security.services.UserDetailsImpl;
import com.expensetracker.backend.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @PostMapping
    public ResponseEntity<BudgetDto.Response> setBudget(
            @Valid @RequestBody BudgetDto.Request request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        BudgetDto.Response response = budgetService.setBudget(request, userDetails.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<?> getBudget(
            @RequestParam int month,
            @RequestParam int year,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        BudgetDto.Response response = budgetService.getBudget(userDetails.getId(), month, year);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }
}
