package com.finapp.service;

import com.finapp.dto.AccountDTO;
import com.finapp.entity.Account;
import com.finapp.entity.User;
import com.finapp.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserService userService;

    public List<AccountDTO> getAll() {
        User user = userService.getCurrentUser();
        return accountRepository.findAllByUserId(user.getId()).stream().map(this::toDTO).toList();
    }

    public AccountDTO getById(Long id) {
        User user = userService.getCurrentUser();
        return accountRepository.findByIdAndUserId(id, user.getId()).map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Account not found: " + id));
    }

    public AccountDTO create(AccountDTO dto) {
        User user = userService.getCurrentUser();
        Account account = Account.builder()
                .name(dto.getName())
                .type(dto.getType())
                .currency(dto.getCurrency())
                .balance(dto.getBalance())
                .user(user)
                .build();
        return toDTO(accountRepository.save(account));
    }

    public void delete(Long id) {
        User user = userService.getCurrentUser();
        Account account = accountRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Account not found: " + id));
        accountRepository.delete(account);
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
