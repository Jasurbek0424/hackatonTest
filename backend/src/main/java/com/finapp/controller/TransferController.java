package com.finapp.controller;

import com.finapp.dto.TransferDTO;
import com.finapp.service.TransferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
@Tag(name = "Transfers", description = "Переводы между счетами текущего пользователя")
public class TransferController {

    private final TransferService transferService;

    @GetMapping
    @Operation(summary = "Список переводов", description = "Возвращает все переводы текущего пользователя, отсортированные по дате")
    @ApiResponse(responseCode = "200", description = "Список переводов",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TransferDTO.class))))
    public List<TransferDTO> getAll() {
        return transferService.getAll();
    }

    @PostMapping
    @Operation(
            summary = "Создать перевод",
            description = "Переводит средства между двумя счетами текущего пользователя. Баланс обоих счетов обновляется автоматически."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Перевод выполнен",
                    content = @Content(schema = @Schema(implementation = TransferDTO.class))),
            @ApiResponse(responseCode = "400", description = "Один из счетов не найден")
    })
    public TransferDTO create(@RequestBody TransferDTO dto) {
        return transferService.create(dto);
    }
}
