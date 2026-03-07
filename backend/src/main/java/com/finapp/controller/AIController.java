package com.finapp.controller;

import com.finapp.ai.AIService;
import com.finapp.dto.StatsDTO;
import com.finapp.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI", description = "AI-категоризация транзакций и финансовые советы")
public class AIController {

    private final AIService aiService;
    private final StatsService statsService;

    @PostMapping("/categorize")
    @Operation(
            summary = "Определить категорию",
            description = "AI определяет категорию транзакции по её описанию (Food, Transport, Shopping и т.д.)"
    )
    @ApiResponse(responseCode = "200", description = "Категория определена",
            content = @Content(schema = @Schema(example = "{\"category\": \"Food\"}")))
    public Map<String, String> categorize(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Описание транзакции",
                    content = @Content(schema = @Schema(example = "{\"description\": \"Tushlik plov\"}")))
            @RequestBody Map<String, String> request) {
        String description = request.getOrDefault("description", "");
        String category = aiService.categorize(description);
        return Map.of("category", category);
    }

    @PostMapping("/advice")
    @Operation(
            summary = "Финансовый совет",
            description = "AI анализирует статистику текущего пользователя и даёт персональные рекомендации"
    )
    @ApiResponse(responseCode = "200", description = "Совет получен",
            content = @Content(schema = @Schema(example = "{\"advice\": \"Ваши расходы на еду составляют 30%...\"}")))
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
