package com.finapp.service;

import com.finapp.dto.TransactionDTO;
import com.finapp.entity.Account;
import com.finapp.entity.Transaction;
import com.finapp.entity.User;
import com.finapp.repository.AccountRepository;
import com.finapp.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserService userService;

    public List<TransactionDTO> getAll(String type, String category, LocalDate from, LocalDate to) {
        User user = userService.getCurrentUser();
        return transactionRepository.findFilteredByUser(user.getId(), type, category, from, to)
                .stream().map(this::toDTO).toList();
    }

    @Transactional
    public TransactionDTO create(TransactionDTO dto) {
        User user = userService.getCurrentUser();
        Account account = accountRepository.findByIdAndUserId(dto.getAccountId(), user.getId())
                .orElseThrow(() -> new RuntimeException("Account not found: " + dto.getAccountId()));

        Transaction tx = Transaction.builder()
                .amount(dto.getAmount())
                .type(dto.getType())
                .category(dto.getCategory())
                .description(dto.getDescription())
                .date(dto.getDate() != null ? dto.getDate() : LocalDate.now())
                .account(account)
                .build();

        tx = transactionRepository.save(tx);

        if ("EXPENSE".equals(dto.getType())) {
            account.setBalance(account.getBalance().subtract(dto.getAmount()));
        } else if ("INCOME".equals(dto.getType())) {
            account.setBalance(account.getBalance().add(dto.getAmount()));
        }
        accountRepository.save(account);

        return toDTO(tx);
    }

    @Transactional
    public void delete(Long id) {
        Transaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + id));

        User user = userService.getCurrentUser();
        if (!tx.getAccount().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Transaction not found: " + id);
        }

        Account account = tx.getAccount();
        if ("EXPENSE".equals(tx.getType())) {
            account.setBalance(account.getBalance().add(tx.getAmount()));
        } else if ("INCOME".equals(tx.getType())) {
            account.setBalance(account.getBalance().subtract(tx.getAmount()));
        }
        accountRepository.save(account);
        transactionRepository.deleteById(id);
    }

    private TransactionDTO toDTO(Transaction t) {
        return TransactionDTO.builder()
                .id(t.getId())
                .amount(t.getAmount())
                .type(t.getType())
                .category(t.getCategory())
                .description(t.getDescription())
                .date(t.getDate())
                .accountId(t.getAccount().getId())
                .accountName(t.getAccount().getName())
                .build();
    }
}
