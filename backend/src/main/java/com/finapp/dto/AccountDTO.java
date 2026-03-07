package com.finapp.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountDTO {
    private Long id;
    private String name;
    private String type;
    private String currency;
    private BigDecimal balance;
}
