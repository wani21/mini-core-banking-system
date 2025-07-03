
package com.corebanking.service;

import com.corebanking.entity.Account;
import com.corebanking.entity.AccountStatus;
import com.corebanking.entity.Transaction;
import com.corebanking.entity.TransactionType;
import com.corebanking.repository.AccountRepository;
import com.corebanking.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountService accountService;

    public Transaction deposit(String accountNumber, BigDecimal amount, String description) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be positive");
        }

        BigDecimal newBalance = account.getBalance().add(amount);
        account.setBalance(newBalance);
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setTransactionType(TransactionType.DEPOSIT);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setBalanceAfter(newBalance);
        transaction.setReferenceNumber(generateReferenceNumber());

        return transactionRepository.save(transaction);
    }

    public Transaction withdraw(String accountNumber, BigDecimal amount, String description) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be positive");
        }

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        BigDecimal newBalance = account.getBalance().subtract(amount);
        account.setBalance(newBalance);
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setTransactionType(TransactionType.WITHDRAWAL);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setBalanceAfter(newBalance);
        transaction.setReferenceNumber(generateReferenceNumber());

        return transactionRepository.save(transaction);
    }

    public void transfer(String fromAccountNumber, String toAccountNumber, BigDecimal amount, String description) {
        Account fromAccount = accountRepository.findByAccountNumber(fromAccountNumber)
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        Account toAccount = accountRepository.findByAccountNumber(toAccountNumber)
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        if (fromAccount.getStatus() != AccountStatus.ACTIVE || toAccount.getStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Both accounts must be active");
        }

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be positive");
        }

        if (fromAccount.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        String referenceNumber = generateReferenceNumber();

        // Debit from source account
        BigDecimal fromNewBalance = fromAccount.getBalance().subtract(amount);
        fromAccount.setBalance(fromNewBalance);
        accountRepository.save(fromAccount);

        Transaction debitTransaction = new Transaction();
        debitTransaction.setAccount(fromAccount);
        debitTransaction.setTransactionType(TransactionType.TRANSFER_OUT);
        debitTransaction.setAmount(amount);
        debitTransaction.setDescription(description);
        debitTransaction.setTransactionDate(LocalDateTime.now());
        debitTransaction.setBalanceAfter(fromNewBalance);
        debitTransaction.setReferenceNumber(referenceNumber);
        debitTransaction.setToAccountNumber(toAccountNumber);
        transactionRepository.save(debitTransaction);

        // Credit to destination account
        BigDecimal toNewBalance = toAccount.getBalance().add(amount);
        toAccount.setBalance(toNewBalance);
        accountRepository.save(toAccount);

        Transaction creditTransaction = new Transaction();
        creditTransaction.setAccount(toAccount);
        creditTransaction.setTransactionType(TransactionType.TRANSFER_IN);
        creditTransaction.setAmount(amount);
        creditTransaction.setDescription(description);
        creditTransaction.setTransactionDate(LocalDateTime.now());
        creditTransaction.setBalanceAfter(toNewBalance);
        creditTransaction.setReferenceNumber(referenceNumber);
        creditTransaction.setFromAccountNumber(fromAccountNumber);
        transactionRepository.save(creditTransaction);
    }

    public Page<Transaction> getAccountTransactions(Long accountId, Pageable pageable) {
        return transactionRepository.findByAccount_AccountIdOrderByTransactionDateDesc(accountId, pageable);
    }

    public List<Transaction> getTransactionsByDateRange(Long accountId, LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findTransactionsByAccountAndDateRange(accountId, startDate, endDate);
    }

    private String generateReferenceNumber() {
        return "TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
