package com.finapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Schema(description = "Счёт пользователя")
public class AccountDTO {

    @Schema(description = "ID счёта", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Schema(description = "Название счёта", example = "Uzcard")
    private String name;

    @Schema(description = "Тип: CARD или CASH", example = "CARD", allowableValues = {"CARD", "CASH"})
    private String type;

    @Schema(description = "Валюта: UZS или USD", example = "UZS", allowableValues = {"UZS", "USD"})
    private String currency;

    @Schema(description = "Баланс счёта", example = "5000000")
    private BigDecimal balance;
}
