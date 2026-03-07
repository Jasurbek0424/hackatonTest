package com.finapp.controller;

import com.finapp.dto.TransactionDTO;
import com.finapp.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Доходы и расходы по счетам текущего пользователя")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    @Operation(
            summary = "Список транзакций",
            description = "Возвращает транзакции с опциональными фильтрами по типу, категории и диапазону дат"
    )
    @ApiResponse(responseCode = "200", description = "Список транзакций",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TransactionDTO.class))))
    public List<TransactionDTO> getAll(
            @Parameter(description = "Тип: INCOME или EXPENSE", example = "EXPENSE")
            @RequestParam(required = false) String type,

            @Parameter(description = "Категория", example = "Food")
            @RequestParam(required = false) String category,

            @Parameter(description = "Дата от (включительно)", example = "2026-03-01")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,

            @Parameter(description = "Дата до (включительно)", example = "2026-03-31")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return transactionService.getAll(type, category, from, to);
    }

    @PostMapping
    @Operation(summary = "Создать транзакцию", description = "Создаёт доход или расход и обновляет баланс счёта")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Транзакция создана",
                    content = @Content(schema = @Schema(implementation = TransactionDTO.class))),
            @ApiResponse(responseCode = "400", description = "Счёт не найден")
    })
    public TransactionDTO create(@RequestBody TransactionDTO dto) {
        return transactionService.create(dto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить транзакцию", description = "Удаляет транзакцию и откатывает изменение баланса")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Транзакция удалена"),
            @ApiResponse(responseCode = "404", description = "Транзакция не найдена")
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID транзакции", example = "1") @PathVariable Long id) {
        transactionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
