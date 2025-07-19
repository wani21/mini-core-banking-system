package com.corebanking.service;

import com.corebanking.entity.Account;
import com.corebanking.entity.AccountStatus;
import com.corebanking.entity.AccountType;
import com.corebanking.entity.Customer;
import com.corebanking.repository.AccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private AccountService accountService;

    private Customer testCustomer;
    private Account testAccount;

    @BeforeEach
    void setUp() {
        testCustomer = new Customer();
        testCustomer.setCustomerId(1L);
        testCustomer.setFirstName("John");
        testCustomer.setLastName("Doe");

        testAccount = new Account();
        testAccount.setAccountId(1L);
        testAccount.setAccountNumber("ACC001");
        testAccount.setAccountType(AccountType.SAVINGS);
        testAccount.setBalance(BigDecimal.valueOf(1000));
        testAccount.setStatus(AccountStatus.ACTIVE);
        testAccount.setCustomer(testCustomer);
        testAccount.setCreatedAt(LocalDateTime.now());
        testAccount.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void testCreateAccount() {
        when(accountRepository.save(any(Account.class))).thenReturn(testAccount);

        Account result = accountService.createAccount(testCustomer, AccountType.SAVINGS, BigDecimal.valueOf(1000));

        assertNotNull(result);
        assertEquals(AccountType.SAVINGS, result.getAccountType());
        assertEquals(BigDecimal.valueOf(1000), result.getBalance());
        assertEquals(AccountStatus.ACTIVE, result.getStatus());
    }

    @Test
    void testGetAccountById() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));

        Optional<Account> result = accountService.getAccountById(1L);

        assertTrue(result.isPresent());
        assertEquals(testAccount.getAccountId(), result.get().getAccountId());
    }

    @Test
    void testUpdateBalance() {
        BigDecimal newBalance = BigDecimal.valueOf(1500);
        testAccount.setBalance(newBalance);
        when(accountRepository.save(any(Account.class))).thenReturn(testAccount);

        Account result = accountService.updateBalance(testAccount, newBalance);

        assertEquals(newBalance, result.getBalance());
    }
}