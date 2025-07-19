
package com.corebanking.service;

import com.corebanking.entity.Account;
import com.corebanking.entity.Transaction;
import com.corebanking.entity.TransactionType;
import com.corebanking.repository.AccountRepository;
import com.corebanking.repository.TransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        List<Account> allAccounts = accountRepository.findAll();
        BigDecimal totalBalance = allAccounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("totalAccounts", allAccounts.size());
        stats.put("totalBalance", totalBalance);
        stats.put("activeAccounts", allAccounts.stream().mapToInt(acc -> 
            acc.getStatus().name().equals("ACTIVE") ? 1 : 0).sum());
        
        return stats;
    }

    public Map<String, Object> getTransactionStats(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> stats = new HashMap<>();
        
        List<Transaction> transactions = transactionRepository.findByTransactionDateBetween(startDate, endDate);
        
        long totalTransactions = transactions.size();
        BigDecimal totalDeposits = transactions.stream()
                .filter(t -> t.getTransactionType() == TransactionType.DEPOSIT)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal totalWithdrawals = transactions.stream()
                .filter(t -> t.getTransactionType() == TransactionType.WITHDRAWAL)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal totalTransfers = transactions.stream()
                .filter(t -> t.getTransactionType() == TransactionType.TRANSFER)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("totalTransactions", totalTransactions);
        stats.put("totalDeposits", totalDeposits);
        stats.put("totalWithdrawals", totalWithdrawals);
        stats.put("totalTransfers", totalTransfers);
        
        return stats;
    }

    public Map<String, BigDecimal> getMonthlyTransactionSummary(int year, int month) {
        Map<String, BigDecimal> summary = new HashMap<>();
        
        LocalDateTime startDate = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endDate = startDate.plusMonths(1).minusDays(1).withHour(23).withMinute(59).withSecond(59);
        
        List<Transaction> monthlyTransactions = transactionRepository.findByTransactionDateBetween(startDate, endDate);
        
        BigDecimal deposits = monthlyTransactions.stream()
                .filter(t -> t.getTransactionType() == TransactionType.DEPOSIT)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal withdrawals = monthlyTransactions.stream()
                .filter(t -> t.getTransactionType() == TransactionType.WITHDRAWAL)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal transfers = monthlyTransactions.stream()
                .filter(t -> t.getTransactionType() == TransactionType.TRANSFER)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        summary.put("deposits", deposits);
        summary.put("withdrawals", withdrawals);
        summary.put("transfers", transfers);
        
        return summary;
    }
}
