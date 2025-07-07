
package com.corebanking.entity;

import com.corebanking.common.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fixed_deposits")
public class FixedDeposit extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fd_id")
    private Long fdId;

    @ManyToOne
    @JoinColumn(name = "account_id", referencedColumnName = "account_id")
    private Account account;

    @NotNull
    @Size(max = 20)
    @Column(name = "fd_number", unique = true, nullable = false)
    private String fdNumber;

    @NotNull
    @Column(name = "principal_amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal principalAmount;

    @NotNull
    @Column(name = "interest_rate", precision = 5, scale = 2, nullable = false)
    private BigDecimal interestRate;

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "maturity_date", nullable = false)
    private LocalDateTime maturityDate;

    @Column(name = "maturity_amount", precision = 15, scale = 2)
    private BigDecimal maturityAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private FixedDepositStatus status = FixedDepositStatus.ACTIVE;

    @Column(name = "is_auto_renewal", nullable = false)
    private Boolean isAutoRenewal = false;

    @Column(name = "premature_closure_date")
    private LocalDateTime prematureClosureDate;

    @Column(name = "premature_penalty_rate", precision = 5, scale = 2)
    private BigDecimal prematurePenaltyRate;

    // Constructors
    public FixedDeposit() {}

    // Getters and Setters
    public Long getFdId() {
        return fdId;
    }

    public void setFdId(Long fdId) {
        this.fdId = fdId;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public String getFdNumber() {
        return fdNumber;
    }

    public void setFdNumber(String fdNumber) {
        this.fdNumber = fdNumber;
    }

    public BigDecimal getPrincipalAmount() {
        return principalAmount;
    }

    public void setPrincipalAmount(BigDecimal principalAmount) {
        this.principalAmount = principalAmount;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getMaturityDate() {
        return maturityDate;
    }

    public void setMaturityDate(LocalDateTime maturityDate) {
        this.maturityDate = maturityDate;
    }

    public BigDecimal getMaturityAmount() {
        return maturityAmount;
    }

    public void setMaturityAmount(BigDecimal maturityAmount) {
        this.maturityAmount = maturityAmount;
    }

    public FixedDepositStatus getStatus() {
        return status;
    }

    public void setStatus(FixedDepositStatus status) {
        this.status = status;
    }

    public Boolean getIsAutoRenewal() {
        return isAutoRenewal;
    }

    public void setIsAutoRenewal(Boolean isAutoRenewal) {
        this.isAutoRenewal = isAutoRenewal;
    }

    public LocalDateTime getPrematureClosureDate() {
        return prematureClosureDate;
    }

    public void setPrematureClosureDate(LocalDateTime prematureClosureDate) {
        this.prematureClosureDate = prematureClosureDate;
    }

    public BigDecimal getPrematurePenaltyRate() {
        return prematurePenaltyRate;
    }

    public void setPrematurePenaltyRate(BigDecimal prematurePenaltyRate) {
        this.prematurePenaltyRate = prematurePenaltyRate;
    }
}
