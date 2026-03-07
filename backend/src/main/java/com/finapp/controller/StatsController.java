package com.finapp.controller;

import com.finapp.dto.StatsDTO;
import com.finapp.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Tag(name = "Stats", description = "Финансовая статистика и аналитика")
public class StatsController {

    private final StatsService statsService;

    @GetMapping
    @Operation(
            summary = "Общая статистика",
            description = "Общий доход, расход, баланс и разбивка по категориям для текущего пользователя"
    )
    @ApiResponse(responseCode = "200", description = "Статистика",
            content = @Content(schema = @Schema(implementation = StatsDTO.class)))
    public StatsDTO getStats() {
        return statsService.getStats();
    }

    @GetMapping("/monthly")
    @Operation(
            summary = "Статистика по месяцам",
            description = "Доходы и расходы, сгруппированные по месяцам (формат YYYY-MM)"
    )
    @ApiResponse(responseCode = "200", description = "Помесячная статистика",
            content = @Content(schema = @Schema(example = "[{\"month\": \"2026-03\", \"income\": 8000000, \"expense\": 1215000}]")))
    public List<Map<String, Object>> getMonthlyStats() {
        return statsService.getMonthlyStats();
    }
}
