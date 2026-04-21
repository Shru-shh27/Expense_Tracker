package com.expensetracker.backend.repository;

import com.expensetracker.backend.model.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BudgetRepository extends MongoRepository<Budget, String> {
    Optional<Budget> findByUserIdAndMonthAndYear(String userId, int month, int year);
}
