package com.finapp.service;

import com.finapp.dto.TransferDTO;
import com.finapp.entity.Account;
import com.finapp.entity.Transfer;
import com.finapp.entity.User;
import com.finapp.repository.AccountRepository;
import com.finapp.repository.TransferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransferService {

    private final TransferRepository transferRepository;
    private final AccountRepository accountRepository;
    private final UserService userService;

    public List<TransferDTO> getAll() {
        User user = userService.getCurrentUser();
        return transferRepository.findAllByUserIdOrderByDateDesc(user.getId()).stream().map(this::toDTO).toList();
    }

    @Transactional
    public TransferDTO create(TransferDTO dto) {
        User user = userService.getCurrentUser();
        Account from = accountRepository.findByIdAndUserId(dto.getFromAccountId(), user.getId())
                .orElseThrow(() -> new RuntimeException("From account not found"));
        Account to = accountRepository.findByIdAndUserId(dto.getToAccountId(), user.getId())
                .orElseThrow(() -> new RuntimeException("To account not found"));

        from.setBalance(from.getBalance().subtract(dto.getAmount()));
        to.setBalance(to.getBalance().add(dto.getAmount()));
        accountRepository.save(from);
        accountRepository.save(to);

        Transfer transfer = Transfer.builder()
                .fromAccount(from)
                .toAccount(to)
                .amount(dto.getAmount())
                .date(dto.getDate() != null ? dto.getDate() : LocalDate.now())
                .build();

        return toDTO(transferRepository.save(transfer));
    }

    private TransferDTO toDTO(Transfer t) {
        return TransferDTO.builder()
                .id(t.getId())
                .fromAccountId(t.getFromAccount().getId())
                .toAccountId(t.getToAccount().getId())
                .fromAccountName(t.getFromAccount().getName())
                .toAccountName(t.getToAccount().getName())
                .amount(t.getAmount())
                .date(t.getDate())
                .build();
    }
}
