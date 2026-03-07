package com.finapp.controller;

import com.finapp.ai.AIService;
import com.finapp.dto.StatsDTO;
import com.finapp.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;
    private final StatsService statsService;

    @PostMapping("/categorize")
    public Map<String, String> categorize(@RequestBody Map<String, String> request) {
        String description = request.getOrDefault("description", "");
        String category = aiService.categorize(description);
        return Map.of("category", category);
    }

    @PostMapping("/advice")
    public Map<String, String> advice() {
        StatsDTO stats = statsService.getStats();
        StringBuilder summary = new StringBuilder();
        summary.append("Total Income: ").append(stats.getTotalIncome()).append("\n");
        summary.append("Total Expense: ").append(stats.getTotalExpense()).append("\n");
        summary.append("Total Balance: ").append(stats.getTotalBalance()).append("\n\n");
        summary.append("Expense by category:\n");
        if (stats.getExpenseByCategory() != null) {
            stats.getExpenseByCategory().forEach((k, v) -> summary.append("- ").append(k).append(": ").append(v).append("\n"));
        }
        String advice = aiService.getAdvice(summary.toString());
        return Map.of("advice", advice);
    }
}
