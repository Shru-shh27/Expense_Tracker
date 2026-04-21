package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.AnalyticsDto;
import com.expensetracker.backend.security.services.UserDetailsImpl;
import com.expensetracker.backend.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsDto.SummaryResponse> getSummary(
            @RequestParam int month,
            @RequestParam int year,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        AnalyticsDto.SummaryResponse response = analyticsService.getSummary(userDetails.getId(), month, year);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/category")
    public ResponseEntity<AnalyticsDto.CategoryResponse> getCategoryBreakdown(
            @RequestParam int month,
            @RequestParam int year,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        AnalyticsDto.CategoryResponse response = analyticsService.getCategoryBreakdown(userDetails.getId(), month, year);
        return ResponseEntity.ok(response);
    }
}
