
package com.corebanking.service;

import com.corebanking.entity.*;
import com.corebanking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InterestService {

    @Autowired
    private InterestRateRepository interestRateRepository;

    @Autowired
    private InterestPostingRepository interestPostingRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionService transactionService;

    public BigDecimal calculateSimpleInterest(BigDecimal principal, BigDecimal rate, int days) {
        BigDecimal dailyRate = rate.divide(BigDecimal.valueOf(100), 8, RoundingMode.HALF_UP)
                                  .divide(BigDecimal.valueOf(365), 8, RoundingMode.HALF_UP);
        return principal.multiply(dailyRate).multiply(BigDecimal.valueOf(days))
                       .setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateCompoundInterest(BigDecimal principal, BigDecimal rate, int months) {
        BigDecimal monthlyRate = rate.divide(BigDecimal.valueOf(100), 8, RoundingMode.HALF_UP)
                                    .divide(BigDecimal.valueOf(12), 8, RoundingMode.HALF_UP);
        
        BigDecimal compoundFactor = BigDecimal.ONE.add(monthlyRate);
        BigDecimal result = principal;
        
        for (int i = 0; i < months; i++) {
            result = result.multiply(compoundFactor);
        }
        
        return result.subtract(principal).setScale(2, RoundingMode.HALF_UP);
    }

    public Optional<InterestRate> getApplicableInterestRate(AccountType accountType, BigDecimal balance) {
        return interestRateRepository.findApplicableRate(accountType, balance, LocalDateTime.now());
    }

    public void postInterest(Long accountId, LocalDateTime fromDate, LocalDateTime toDate) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Optional<InterestRate> rateOptional = getApplicableInterestRate(account.getAccountType(), account.getBalance());
        
        if (rateOptional.isEmpty()) {
            return; // No applicable rate found
        }

        InterestRate rate = rateOptional.get();
        long days = ChronoUnit.DAYS.between(fromDate, toDate);
        
        if (days <= 0) {
            return;
        }

        BigDecimal interestAmount = calculateSimpleInterest(account.getBalance(), rate.getAnnualRate(), (int) days);

        if (interestAmount.compareTo(BigDecimal.ZERO) > 0) {
            // Create interest posting record
            InterestPosting posting = new InterestPosting();
            posting.setAccount(account);
            posting.setPostingDate(LocalDateTime.now());
            posting.setInterestAmount(interestAmount);
            posting.setCalculationPeriodFrom(fromDate);
            posting.setCalculationPeriodTo(toDate);
            posting.setAverageBalance(account.getBalance());
            posting.setInterestRate(rate.getAnnualRate());

            interestPostingRepository.save(posting);

            // Credit interest to account
            Transaction interestTransaction = transactionService.deposit(
                account.getAccountNumber(), 
                interestAmount, 
                "Interest credit for period " + fromDate.toLocalDate() + " to " + toDate.toLocalDate()
            );
            
            posting.setTransactionReference(interestTransaction.getReferenceNumber());
            interestPostingRepository.save(posting);
        }
    }

    public List<InterestPosting> getAccountInterestHistory(Long accountId) {
        return interestPostingRepository.findByAccount_AccountId(accountId);
    }

    public void processMonthlyInterest() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastMonth = now.minusMonths(1);
        
        List<Account> savingsAccounts = accountRepository.findByAccountTypeAndStatus(
            AccountType.SAVINGS, AccountStatus.ACTIVE);

        for (Account account : savingsAccounts) {
            postInterest(account.getAccountId(), lastMonth, now);
        }
    }

    public InterestRate createInterestRate(AccountType accountType, BigDecimal annualRate, 
                                         BigDecimal minBalance, BigDecimal maxBalance) {
        InterestRate rate = new InterestRate(accountType, annualRate, LocalDateTime.now());
        rate.setMinBalance(minBalance);
        rate.setMaxBalance(maxBalance);
        
        return interestRateRepository.save(rate);
    }

    public List<InterestRate> getActiveRates(AccountType accountType) {
        return interestRateRepository.findByAccountTypeAndIsActiveTrue(accountType);
    }
}
