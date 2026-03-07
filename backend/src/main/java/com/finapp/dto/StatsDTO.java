package com.finapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.util.Map;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Schema(description = "Финансовая статистика пользователя")
public class StatsDTO {

    @Schema(description = "Общий доход", example = "11000000")
    private BigDecimal totalIncome;

    @Schema(description = "Общий расход", example = "1215000")
    private BigDecimal totalExpense;

    @Schema(description = "Общий баланс всех счетов", example = "9500000")
    private BigDecimal totalBalance;

    @Schema(description = "Расходы по категориям", example = "{\"Food\": 255000, \"Transport\": 225000}")
    private Map<String, BigDecimal> expenseByCategory;

    @Schema(description = "Доходы по категориям", example = "{\"Salary\": 8000000, \"Freelance\": 3000000}")
    private Map<String, BigDecimal> incomeByCategory;
}
