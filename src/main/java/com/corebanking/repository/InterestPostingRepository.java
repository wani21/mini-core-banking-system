
package com.corebanking.repository;

import com.corebanking.entity.InterestPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InterestPostingRepository extends JpaRepository<InterestPosting, Long> {
    
    List<InterestPosting> findByAccount_AccountId(Long accountId);
    
    @Query("SELECT ip FROM InterestPosting ip WHERE ip.account.accountId = :accountId " +
           "AND ip.postingDate BETWEEN :startDate AND :endDate ORDER BY ip.postingDate DESC")
    List<InterestPosting> findByAccountAndDateRange(@Param("accountId") Long accountId,
                                                   @Param("startDate") LocalDateTime startDate,
                                                   @Param("endDate") LocalDateTime endDate);
}
