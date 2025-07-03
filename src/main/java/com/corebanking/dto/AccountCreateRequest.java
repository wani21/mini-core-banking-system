
package com.corebanking.dto;

import com.corebanking.entity.AccountType;
import jakarta.validation.constraints.NotNull;

public class AccountCreateRequest {
    
    @NotNull(message = "Account type is required")
    private AccountType accountType;

    public AccountCreateRequest() {}

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }
}
