
package com.corebanking.repository;

import com.corebanking.entity.Transaction;
import com.corebanking.entity.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Page<Transaction> findByAccount_AccountIdOrderByTransactionDateDesc(Long accountId, Pageable pageable);
    
    List<Transaction> findByAccount_AccountIdAndTransactionType(Long accountId, TransactionType transactionType);
    
    @Query("SELECT t FROM Transaction t WHERE t.account.accountId = :accountId AND t.transactionDate BETWEEN :startDate AND :endDate ORDER BY t.transactionDate DESC")
    List<Transaction> findTransactionsByAccountAndDateRange(@Param("accountId") Long accountId, 
                                                           @Param("startDate") LocalDateTime startDate, 
                                                           @Param("endDate") LocalDateTime endDate);
}
