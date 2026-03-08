package com.finapp.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FinPilot API")
                        .description("""
                                REST API для управления личными финансами.

                                ## Авторизация
                                1. Зарегистрируйтесь через `POST /api/auth/register` или войдите через `POST /api/auth/login`
                                2. Скопируйте `token` из ответа
                                3. Нажмите кнопку **Authorize** и вставьте токен
                                4. Все последующие запросы будут отправляться с JWT

                                ## Демо-аккаунт
                                - **Email:** `demo@finpilot.uz`
                                - **Пароль:** `demo123`
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("FinPilot Team")))
                .tags(List.of(
                        new Tag().name("Authentication").description("Регистрация и авторизация (публичные эндпоинты)"),
                        new Tag().name("Users").description("Профиль текущего пользователя"),
                        new Tag().name("Accounts").description("CRUD операции со счетами пользователя"),
                        new Tag().name("Transactions").description("Доходы и расходы по счетам"),
                        new Tag().name("Transfers").description("Переводы между счетами"),
                        new Tag().name("Stats").description("Статистика и аналитика"),
                        new Tag().name("AI").description("AI-категоризация и финансовые советы")
                ))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .bearerFormat("JWT")
                                        .scheme("bearer")
                                        .description("Введите JWT токен без префикса Bearer")));
    }
}
