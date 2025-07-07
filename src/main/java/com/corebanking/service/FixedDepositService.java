
package com.corebanking.service;

import com.corebanking.entity.*;
import com.corebanking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
@Transactional
public class FixedDepositService {

    @Autowired
    private FixedDepositRepository fixedDepositRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private InterestService interestService;

    @Autowired
    private TransactionService transactionService;

    public FixedDeposit createFixedDeposit(String accountNumber, BigDecimal amount, 
                                          BigDecimal interestRate, Integer tenureMonths) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }

        if (amount.compareTo(BigDecimal.valueOf(1000)) < 0) {
            throw new RuntimeException("Minimum FD amount is $1000");
        }

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // Debit amount from account
        transactionService.withdraw(accountNumber, amount, "Fixed Deposit creation");

        // Create FD
        FixedDeposit fd = new FixedDeposit();
        fd.setAccount(account);
        fd.setFdNumber(generateFdNumber());
        fd.setPrincipalAmount(amount);
        fd.setInterestRate(interestRate);
        fd.setTenureMonths(tenureMonths);
        fd.setStartDate(LocalDateTime.now());
        fd.setMaturityDate(LocalDateTime.now().plusMonths(tenureMonths));
        
        // Calculate maturity amount using compound interest
        BigDecimal interestAmount = interestService.calculateCompoundInterest(amount, interestRate, tenureMonths);
        fd.setMaturityAmount(amount.add(interestAmount));
        fd.setStatus(FixedDepositStatus.ACTIVE);

        return fixedDepositRepository.save(fd);
    }

    public FixedDeposit closeFixedDeposit(String fdNumber, boolean isPremature) {
        FixedDeposit fd = fixedDepositRepository.findByFdNumber(fdNumber)
                .orElseThrow(() -> new RuntimeException("Fixed Deposit not found"));

        if (fd.getStatus() != FixedDepositStatus.ACTIVE) {
            throw new RuntimeException("Fixed Deposit is not active");
        }

        BigDecimal payoutAmount;
        String description;

        if (isPremature) {
            // Calculate premature closure amount with penalty
            LocalDateTime now = LocalDateTime.now();
            fd.setPrematureClosureDate(now);
            fd.setStatus(FixedDepositStatus.CLOSED_PREMATURELY);
            
            // Apply penalty (typically 1-2% reduction in interest rate)
            BigDecimal penaltyRate = fd.getInterestRate().subtract(BigDecimal.valueOf(1.0));
            if (penaltyRate.compareTo(BigDecimal.ZERO) < 0) {
                penaltyRate = BigDecimal.ZERO;
            }
            
            int monthsCompleted = (int) java.time.temporal.ChronoUnit.MONTHS.between(fd.getStartDate(), now);
            if (monthsCompleted < 1) monthsCompleted = 1;
            
            BigDecimal interestAmount = interestService.calculateCompoundInterest(
                fd.getPrincipalAmount(), penaltyRate, monthsCompleted);
            payoutAmount = fd.getPrincipalAmount().add(interestAmount);
            description = "Premature closure of FD " + fdNumber;
        } else {
            // Normal maturity
            fd.setStatus(FixedDepositStatus.MATURED);
            payoutAmount = fd.getMaturityAmount();
            description = "Maturity of FD " + fdNumber;
        }

        // Credit amount to account
        transactionService.deposit(fd.getAccount().getAccountNumber(), payoutAmount, description);

        return fixedDepositRepository.save(fd);
    }

    public List<FixedDeposit> getCustomerFixedDeposits(Long customerId) {
        return fixedDepositRepository.findByAccount_Customer_CustomerId(customerId);
    }

    public List<FixedDeposit> getAccountFixedDeposits(Long accountId) {
        return fixedDepositRepository.findByAccount_AccountId(accountId);
    }

    public void processMaturedDeposits() {
        List<FixedDeposit> maturedDeposits = fixedDepositRepository.findMaturedDeposits(LocalDateTime.now());
        
        for (FixedDeposit fd : maturedDeposits) {
            if (fd.getIsAutoRenewal()) {
                // Auto-renew the FD
                renewFixedDeposit(fd);
            } else {
                // Close and credit to account
                closeFixedDeposit(fd.getFdNumber(), false);
            }
        }
    }

    private void renewFixedDeposit(FixedDeposit fd) {
        fd.setStartDate(LocalDateTime.now());
        fd.setMaturityDate(LocalDateTime.now().plusMonths(fd.getTenureMonths()));
        fd.setPrincipalAmount(fd.getMaturityAmount());
        
        BigDecimal newInterestAmount = interestService.calculateCompoundInterest(
            fd.getPrincipalAmount(), fd.getInterestRate(), fd.getTenureMonths());
        fd.setMaturityAmount(fd.getPrincipalAmount().add(newInterestAmount));
        fd.setStatus(FixedDepositStatus.RENEWED);
        
        fixedDepositRepository.save(fd);
    }

    private String generateFdNumber() {
        String fdNumber;
        do {
            Random random = new Random();
            long number = 100000000L + (long)(random.nextDouble() * 900000000L);
            fdNumber = "FD" + String.valueOf(number);
        } while (fixedDepositRepository.existsByFdNumber(fdNumber));
        
        return fdNumber;
    }

    public Optional<FixedDeposit> getFixedDepositByNumber(String fdNumber) {
        return fixedDepositRepository.findByFdNumber(fdNumber);
    }
}
