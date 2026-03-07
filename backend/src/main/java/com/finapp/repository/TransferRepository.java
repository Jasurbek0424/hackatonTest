package com.finapp.repository;

import com.finapp.entity.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransferRepository extends JpaRepository<Transfer, Long> {

    List<Transfer> findAllByOrderByDateDesc();

    @Query("SELECT t FROM Transfer t WHERE t.fromAccount.user.id = :userId OR t.toAccount.user.id = :userId ORDER BY t.date DESC")
    List<Transfer> findAllByUserIdOrderByDateDesc(@Param("userId") Long userId);
}
