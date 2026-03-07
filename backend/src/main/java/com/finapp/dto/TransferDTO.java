package com.finapp.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TransferDTO {
    private Long id;
    private Long fromAccountId;
    private Long toAccountId;
    private String fromAccountName;
    private String toAccountName;
    private BigDecimal amount;
    private LocalDate date;
}
