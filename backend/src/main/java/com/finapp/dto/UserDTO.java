package com.finapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Schema(description = "Профиль пользователя")
public class UserDTO {

    @Schema(description = "ID пользователя", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Schema(description = "Email", example = "demo@finpilot.uz", accessMode = Schema.AccessMode.READ_ONLY)
    private String email;

    @Schema(description = "Имя", example = "Demo")
    private String firstName;

    @Schema(description = "Фамилия", example = "User")
    private String lastName;

    @Schema(description = "Дата регистрации", example = "2026-03-07T12:00:00", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;
}
