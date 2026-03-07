package com.finapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Schema(description = "Запрос на регистрацию")
public class RegisterRequest {

    @NotBlank(message = "Email обязателен")
    @Email(message = "Некорректный формат email")
    @Schema(description = "Email пользователя", example = "user@example.com")
    private String email;

    @NotBlank(message = "Пароль обязателен")
    @Size(min = 6, message = "Пароль должен содержать минимум 6 символов")
    @Schema(description = "Пароль (мин. 6 символов)", example = "mypassword123")
    private String password;

    @NotBlank(message = "Имя обязательно")
    @Schema(description = "Имя", example = "Alisher")
    private String firstName;

    @Schema(description = "Фамилия", example = "Karimov")
    private String lastName;
}
