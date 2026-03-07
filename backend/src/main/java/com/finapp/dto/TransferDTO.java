package com.finapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Schema(description = "Перевод между счетами")
public class TransferDTO {

    @Schema(description = "ID перевода", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Schema(description = "ID счёта отправителя", example = "1")
    private Long fromAccountId;

    @Schema(description = "ID счёта получателя", example = "2")
    private Long toAccountId;

    @Schema(description = "Название счёта отправителя", example = "Uzcard", accessMode = Schema.AccessMode.READ_ONLY)
    private String fromAccountName;

    @Schema(description = "Название счёта получателя", example = "Humo", accessMode = Schema.AccessMode.READ_ONLY)
    private String toAccountName;

    @Schema(description = "Сумма перевода", example = "500000")
    private BigDecimal amount;

    @Schema(description = "Дата перевода (по умолчанию — сегодня)", example = "2026-03-07")
    private LocalDate date;
}
