
package com.corebanking.repository;

import com.corebanking.entity.Account;
import com.corebanking.entity.AccountStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    
    List<Account> findByCustomer_CustomerId(Long customerId);
    
    Optional<Account> findByAccountNumber(String accountNumber);
    
    List<Account> findByStatus(AccountStatus status);
    
    Boolean existsByAccountNumber(String accountNumber);
}
