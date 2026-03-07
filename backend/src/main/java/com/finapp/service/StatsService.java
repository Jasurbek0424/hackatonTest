package com.finapp.service;

import com.finapp.dto.StatsDTO;
import com.finapp.repository.AccountRepository;
import com.finapp.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    public StatsDTO getStats() {
        BigDecimal totalIncome = transactionRepository.sumByType("INCOME");
        BigDecimal totalExpense = transactionRepository.sumByType("EXPENSE");
        BigDecimal totalBalance = accountRepository.getTotalBalance();

        Map<String, BigDecimal> expenseByCategory = new LinkedHashMap<>();
        for (Object[] row : transactionRepository.sumByCategoryAndType("EXPENSE")) {
            String cat = row[0] != null ? (String) row[0] : "Other";
            expenseByCategory.put(cat, (BigDecimal) row[1]);
        }

        Map<String, BigDecimal> incomeByCategory = new LinkedHashMap<>();
        for (Object[] row : transactionRepository.sumByCategoryAndType("INCOME")) {
            String cat = row[0] != null ? (String) row[0] : "Other";
            incomeByCategory.put(cat, (BigDecimal) row[1]);
        }

        return StatsDTO.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .totalBalance(totalBalance)
                .expenseByCategory(expenseByCategory)
                .incomeByCategory(incomeByCategory)
                .build();
    }

    public List<Map<String, Object>> getMonthlyStats() {
        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Map<String, Object>> monthMap = new LinkedHashMap<>();

        for (Object[] row : transactionRepository.monthlyStats()) {
            String month = (String) row[0];
            String type = (String) row[1];
            BigDecimal sum = (BigDecimal) row[2];

            monthMap.computeIfAbsent(month, k -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("month", k);
                m.put("income", BigDecimal.ZERO);
                m.put("expense", BigDecimal.ZERO);
                return m;
            });
            monthMap.get(month).put(type.toLowerCase(), sum);
        }

        result.addAll(monthMap.values());
        return result;
    }
}
