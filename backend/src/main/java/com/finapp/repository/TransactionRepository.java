package com.finapp.repository;

import com.finapp.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByTypeOrderByDateDesc(String type);

    List<Transaction> findAllByOrderByDateDesc();

    @Query("SELECT t FROM Transaction t WHERE " +
           "(:type IS NULL OR t.type = :type) AND " +
           "(:category IS NULL OR t.category = :category) AND " +
           "(:from IS NULL OR t.date >= :from) AND " +
           "(:to IS NULL OR t.date <= :to) " +
           "ORDER BY t.date DESC")
    List<Transaction> findFiltered(@Param("type") String type,
                                   @Param("category") String category,
                                   @Param("from") LocalDate from,
                                   @Param("to") LocalDate to);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = :type")
    BigDecimal sumByType(@Param("type") String type);

    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t WHERE t.type = :type GROUP BY t.category")
    List<Object[]> sumByCategoryAndType(@Param("type") String type);

    @Query("SELECT FUNCTION('TO_CHAR', t.date, 'YYYY-MM') as month, t.type, SUM(t.amount) " +
           "FROM Transaction t GROUP BY FUNCTION('TO_CHAR', t.date, 'YYYY-MM'), t.type " +
           "ORDER BY month")
    List<Object[]> monthlyStats();
}
