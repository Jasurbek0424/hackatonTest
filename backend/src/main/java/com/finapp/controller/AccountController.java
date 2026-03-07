package com.finapp.controller;

import com.finapp.dto.AccountDTO;
import com.finapp.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@Tag(name = "Accounts", description = "CRUD операции со счетами текущего пользователя")
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    @Operation(summary = "Список счетов", description = "Возвращает все счета текущего пользователя")
    @ApiResponse(responseCode = "200", description = "Список счетов",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = AccountDTO.class))))
    public List<AccountDTO> getAll() {
        return accountService.getAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить счёт по ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Счёт найден",
                    content = @Content(schema = @Schema(implementation = AccountDTO.class))),
            @ApiResponse(responseCode = "404", description = "Счёт не найден")
    })
    public AccountDTO getById(
            @Parameter(description = "ID счёта", example = "1") @PathVariable Long id) {
        return accountService.getById(id);
    }

    @PostMapping
    @Operation(summary = "Создать счёт", description = "Создаёт новый счёт для текущего пользователя")
    @ApiResponse(responseCode = "200", description = "Счёт создан",
            content = @Content(schema = @Schema(implementation = AccountDTO.class)))
    public AccountDTO create(@RequestBody AccountDTO dto) {
        return accountService.create(dto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить счёт")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Счёт удалён"),
            @ApiResponse(responseCode = "404", description = "Счёт не найден")
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID счёта", example = "1") @PathVariable Long id) {
        accountService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
