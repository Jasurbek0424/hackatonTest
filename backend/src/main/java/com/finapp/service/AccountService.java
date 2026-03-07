package com.finapp.service;

import com.finapp.dto.AccountDTO;
import com.finapp.entity.Account;
import com.finapp.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    public List<AccountDTO> getAll() {
        return accountRepository.findAll().stream().map(this::toDTO).toList();
    }

    public AccountDTO getById(Long id) {
        return accountRepository.findById(id).map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Account not found: " + id));
    }

    public AccountDTO create(AccountDTO dto) {
        Account account = Account.builder()
                .name(dto.getName())
                .type(dto.getType())
                .currency(dto.getCurrency())
                .balance(dto.getBalance())
                .build();
        return toDTO(accountRepository.save(account));
    }

    public void delete(Long id) {
        accountRepository.deleteById(id);
    }

    private AccountDTO toDTO(Account a) {
        return AccountDTO.builder()
                .id(a.getId())
                .name(a.getName())
                .type(a.getType())
                .currency(a.getCurrency())
                .balance(a.getBalance())
                .build();
    }
}
