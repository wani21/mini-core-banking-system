
package com.corebanking.service;

import com.corebanking.entity.*;
import com.corebanking.repository.AccountRepository;
import com.corebanking.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public Account createAccount(Long customerId, AccountType accountType) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Check if customer KYC is approved
        if (customer.getKycStatus() != KycStatus.APPROVED) {
            throw new RuntimeException("Customer KYC must be approved before creating account");
        }

        // Generate unique account number
        String accountNumber = generateAccountNumber();
        
        Account account = new Account(customer, accountNumber, accountType);
        return accountRepository.save(account);
    }

    public List<Account> getCustomerAccounts(Long customerId) {
        return accountRepository.findByCustomer_CustomerId(customerId);
    }

    public Optional<Account> getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber);
    }

    public Account updateAccountStatus(Long accountId, AccountStatus status) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        account.setStatus(status);
        if (status == AccountStatus.CLOSED) {
            account.setClosedDate(LocalDateTime.now());
        }
        
        return accountRepository.save(account);
    }

    public void updateAccountBalance(Long accountId, BigDecimal newBalance) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        account.setBalance(newBalance);
        accountRepository.save(account);
    }

    private String generateAccountNumber() {
        String accountNumber;
        do {
            Random random = new Random();
            long number = 1000000000L + (long)(random.nextDouble() * 9000000000L);
            accountNumber = String.valueOf(number);
        } while (accountRepository.existsByAccountNumber(accountNumber));
        
        return accountNumber;
    }
}
