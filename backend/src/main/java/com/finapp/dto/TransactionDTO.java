package com.finapp.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TransactionDTO {
    private Long id;
    private BigDecimal amount;
    private String type;
    private String category;
    private String description;
    private LocalDate date;
    private Long accountId;
    private String accountName;
}
