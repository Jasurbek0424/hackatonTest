package com.finapp.config;

import com.finapp.entity.Account;
import com.finapp.entity.Transaction;
import com.finapp.repository.AccountRepository;
import com.finapp.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public void run(String... args) {
        if (accountRepository.count() > 0) return;

        Account uzcard = accountRepository.save(Account.builder()
                .name("Uzcard")
                .type("CARD")
                .currency("UZS")
                .balance(new BigDecimal("5000000"))
                .build());

        Account humo = accountRepository.save(Account.builder()
                .name("Humo")
                .type("CARD")
                .currency("UZS")
                .balance(new BigDecimal("3000000"))
                .build());

        Account cash = accountRepository.save(Account.builder()
                .name("Cash")
                .type("CASH")
                .currency("UZS")
                .balance(new BigDecimal("1500000"))
                .build());

        Account usd = accountRepository.save(Account.builder()
                .name("USD Cash")
                .type("CASH")
                .currency("USD")
                .balance(new BigDecimal("500"))
                .build());

        // Demo transactions
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
