package com.finapp.config;

import com.finapp.entity.Account;
import com.finapp.entity.Role;
import com.finapp.entity.Transaction;
import com.finapp.entity.User;
import com.finapp.repository.AccountRepository;
import com.finapp.repository.TransactionRepository;
import com.finapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (accountRepository.count() > 0) return;

        User demoUser = userRepository.save(User.builder()
                .email("demo@finpilot.uz")
                .password(passwordEncoder.encode("demo123"))
                .firstName("Demo")
                .lastName("User")
                .role(Role.USER)
                .build());

        Account uzcard = accountRepository.save(Account.builder()
                .name("Uzcard")
                .type("CARD")
                .currency("UZS")
                .balance(new BigDecimal("5000000"))
                .user(demoUser)
                .build());

        Account humo = accountRepository.save(Account.builder()
                .name("Humo")
                .type("CARD")
                .currency("UZS")
                .balance(new BigDecimal("3000000"))
                .user(demoUser)
                .build());

        Account cash = accountRepository.save(Account.builder()
                .name("Cash")
                .type("CASH")
                .currency("UZS")
                .balance(new BigDecimal("1500000"))
                .user(demoUser)
                .build());

        accountRepository.save(Account.builder()
                .name("USD Cash")
                .type("CASH")
                .currency("USD")
                .balance(new BigDecimal("500"))
                .user(demoUser)
                .build());

        LocalDate today = LocalDate.now();
        createTx("Tushlik - plov", "EXPENSE", "Food", new BigDecimal("45000"), today, uzcard);
        createTx("Taxi - uyga", "EXPENSE", "Transport", new BigDecimal("25000"), today, uzcard);
        createTx("Kiyim do'koni", "EXPENSE", "Shopping", new BigDecimal("350000"), today.minusDays(1), humo);
        createTx("Internet to'lov", "EXPENSE", "Bills", new BigDecimal("100000"), today.minusDays(2), uzcard);
        createTx("Dorixona", "EXPENSE", "Health", new BigDecimal("75000"), today.minusDays(3), cash);
        createTx("Kino", "EXPENSE", "Entertainment", new BigDecimal("60000"), today.minusDays(4), humo);
        createTx("Udemy kurs", "EXPENSE", "Education", new BigDecimal("150000"), today.minusDays(5), uzcard);
        createTx("Oylik maosh", "INCOME", "Salary", new BigDecimal("8000000"), today.minusDays(10), uzcard);
        createTx("Freelance loyiha", "INCOME", "Freelance", new BigDecimal("3000000"), today.minusDays(7), humo);
        createTx("Ertalabki nonushta", "EXPENSE", "Food", new BigDecimal("30000"), today.minusDays(1), cash);
        createTx("Benzin", "EXPENSE", "Transport", new BigDecimal("200000"), today.minusDays(3), uzcard);
        createTx("Supermarket", "EXPENSE", "Food", new BigDecimal("180000"), today.minusDays(2), humo);
    }

    private void createTx(String desc, String type, String category, BigDecimal amount, LocalDate date, Account account) {
        transactionRepository.save(Transaction.builder()
                .description(desc)
                .type(type)
                .category(category)
                .amount(amount)
                .date(date)
                .account(account)
                .build());
    }
}
