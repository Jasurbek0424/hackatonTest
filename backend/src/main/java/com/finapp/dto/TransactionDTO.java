package com.finapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Schema(description = "Транзакция (доход/расход)")
public class TransactionDTO {

    @Schema(description = "ID транзакции", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Schema(description = "Сумма", example = "45000")
    private BigDecimal amount;

    @Schema(description = "Тип: INCOME или EXPENSE", example = "EXPENSE", allowableValues = {"INCOME", "EXPENSE"})
    private String type;

    @Schema(description = "Категория", example = "Food")
    private String category;

    @Schema(description = "Описание", example = "Tushlik - plov")
    private String description;

    @Schema(description = "Дата (по умолчанию — сегодня)", example = "2026-03-07")
    private LocalDate date;

    @Schema(description = "ID счёта", example = "1")
    private Long accountId;

    @Schema(description = "Название счёта", example = "Uzcard", accessMode = Schema.AccessMode.READ_ONLY)
    private String accountName;
}
