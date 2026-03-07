package com.finapp.controller;

import com.finapp.dto.StatsDTO;
import com.finapp.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping
    public StatsDTO getStats() {
        return statsService.getStats();
    }

    @GetMapping("/monthly")
    public List<Map<String, Object>> getMonthlyStats() {
        return statsService.getMonthlyStats();
    }
}
