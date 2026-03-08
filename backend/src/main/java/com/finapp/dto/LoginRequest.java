package com.finapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Schema(description = "Запрос на авторизацию")
public class LoginRequest {

    @NotBlank(message = "Email обязателен")
    @Email(message = "Некорректный формат email")
    @Schema(description = "Email пользователя", example = "demo@finpilot.uz")
    private String email;

    @NotBlank(message = "Пароль обязателен")
    @Schema(description = "Пароль", example = "demo123")
    private String password;
}
