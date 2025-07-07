
package com.corebanking.repository;

import com.corebanking.entity.FixedDeposit;
import com.corebanking.entity.FixedDepositStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FixedDepositRepository extends JpaRepository<FixedDeposit, Long> {
    
    List<FixedDeposit> findByAccount_AccountId(Long accountId);
    
    List<FixedDeposit> findByAccount_Customer_CustomerId(Long customerId);
    
    Optional<FixedDeposit> findByFdNumber(String fdNumber);
    
    List<FixedDeposit> findByStatus(FixedDepositStatus status);
    
    @Query("SELECT fd FROM FixedDeposit fd WHERE fd.status = 'ACTIVE' AND fd.maturityDate <= :date")
    List<FixedDeposit> findMaturedDeposits(@Param("date") LocalDateTime date);
    
    Boolean existsByFdNumber(String fdNumber);
}
