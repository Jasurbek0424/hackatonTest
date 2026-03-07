package com.finapp.controller;

import com.finapp.dto.TransferDTO;
import com.finapp.service.TransferService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
public class TransferController {

    private final TransferService transferService;

    @GetMapping
    public List<TransferDTO> getAll() {
        return transferService.getAll();
    }

    @PostMapping
    public TransferDTO create(@RequestBody TransferDTO dto) {
        return transferService.create(dto);
    }
}
