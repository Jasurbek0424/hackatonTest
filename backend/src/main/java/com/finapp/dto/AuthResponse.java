package com.finapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Schema(description = "Ответ авторизации с JWT токеном")
public class AuthResponse {

    @Schema(description = "JWT токен для Authorization header", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String token;

    @Schema(description = "Email пользователя", example = "demo@finpilot.uz")
    private String email;

    @Schema(description = "Имя", example = "Demo")
    private String firstName;

    @Schema(description = "Фамилия", example = "User")
    private String lastName;
}
