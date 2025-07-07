
package com.corebanking.entity;

import com.corebanking.common.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "interest_postings")
public class InterestPosting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "posting_id")
    private Long postingId;

    @ManyToOne
    @JoinColumn(name = "account_id", referencedColumnName = "account_id")
    private Account account;

    @NotNull
    @Column(name = "posting_date", nullable = false)
    private LocalDateTime postingDate;

    @NotNull
    @Column(name = "interest_amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal interestAmount;

    @NotNull
    @Column(name = "calculation_period_from", nullable = false)
    private LocalDateTime calculationPeriodFrom;

    @NotNull
    @Column(name = "calculation_period_to", nullable = false)
    private LocalDateTime calculationPeriodTo;

    @NotNull
    @Column(name = "average_balance", precision = 15, scale = 2, nullable = false)
    private BigDecimal averageBalance;

    @NotNull
    @Column(name = "interest_rate", precision = 5, scale = 2, nullable = false)
    private BigDecimal interestRate;

    @Column(name = "transaction_reference")
    private String transactionReference;

    // Constructors
    public InterestPosting() {}

    // Getters and Setters
    public Long getPostingId() {
        return postingId;
    }

    public void setPostingId(Long postingId) {
        this.postingId = postingId;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public LocalDateTime getPostingDate() {
        return postingDate;
    }

    public void setPostingDate(LocalDateTime postingDate) {
        this.postingDate = postingDate;
    }

    public BigDecimal getInterestAmount() {
        return interestAmount;
    }

    public void setInterestAmount(BigDecimal interestAmount) {
        this.interestAmount = interestAmount;
    }

    public LocalDateTime getCalculationPeriodFrom() {
        return calculationPeriodFrom;
    }

    public void setCalculationPeriodFrom(LocalDateTime calculationPeriodFrom) {
        this.calculationPeriodFrom = calculationPeriodFrom;
    }

    public LocalDateTime getCalculationPeriodTo() {
        return calculationPeriodTo;
    }

    public void setCalculationPeriodTo(LocalDateTime calculationPeriodTo) {
        this.calculationPeriodTo = calculationPeriodTo;
    }

    public BigDecimal getAverageBalance() {
        return averageBalance;
    }

    public void setAverageBalance(BigDecimal averageBalance) {
        this.averageBalance = averageBalance;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
    }
}
