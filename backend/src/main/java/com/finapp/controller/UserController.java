package com.finapp.controller;

import com.finapp.dto.UserDTO;
import com.finapp.entity.User;
import com.finapp.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Управление профилем текущего пользователя")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(
            summary = "Получить профиль",
            description = "Возвращает данные текущего авторизованного пользователя"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Профиль пользователя",
                    content = @Content(schema = @Schema(implementation = UserDTO.class))),
            @ApiResponse(responseCode = "401", description = "Не авторизован")
    })
    public UserDTO getCurrentUser() {
        return toDTO(userService.getCurrentUser());
    }

    @PutMapping("/me")
    @Operation(
            summary = "Обновить профиль",
            description = "Обновляет имя и/или фамилию. Передайте только те поля, которые хотите изменить."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Профиль обновлён",
                    content = @Content(schema = @Schema(implementation = UserDTO.class))),
            @ApiResponse(responseCode = "401", description = "Не авторизован")
    })
    public UserDTO updateProfile(@RequestBody UserDTO dto) {
        User user = userService.getCurrentUser();
        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        user = userService.save(user);
        return toDTO(user);
    }

    private UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
