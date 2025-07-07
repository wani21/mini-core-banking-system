
package com.corebanking.repository;

import com.corebanking.entity.AccountType;
import com.corebanking.entity.InterestRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InterestRateRepository extends JpaRepository<InterestRate, Long> {
    
    List<InterestRate> findByAccountTypeAndIsActiveTrue(AccountType accountType);
    
    @Query("SELECT ir FROM InterestRate ir WHERE ir.accountType = :accountType AND ir.isActive = true " +
           "AND ir.effectiveFrom <= :date AND (ir.effectiveTo IS NULL OR ir.effectiveTo >= :date) " +
           "AND (ir.minBalance IS NULL OR ir.minBalance <= :balance) " +
           "AND (ir.maxBalance IS NULL OR ir.maxBalance >= :balance)")
    Optional<InterestRate> findApplicableRate(@Param("accountType") AccountType accountType, 
                                            @Param("balance") BigDecimal balance, 
                                            @Param("date") LocalDateTime date);
}
