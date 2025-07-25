
package com.corebanking.repository;

import com.corebanking.entity.Customer;
import com.corebanking.entity.KycStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByUser_UserId(Long userId);
    
    Optional<Customer> findByPhoneNumber(String phoneNumber);
    
    List<Customer> findByKycStatus(KycStatus kycStatus);
    
    Boolean existsByPhoneNumber(String phoneNumber);
}
