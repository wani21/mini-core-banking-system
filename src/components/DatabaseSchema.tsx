
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

const DatabaseSchema = () => {
  const tables = [
    {
      name: "users",
      description: "Core user authentication table",
      columns: [
        { name: "user_id", type: "BIGINT", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "username", type: "VARCHAR(50)", constraints: "UNIQUE, NOT NULL" },
        { name: "email", type: "VARCHAR(100)", constraints: "UNIQUE, NOT NULL" },
        { name: "password_hash", type: "VARCHAR(255)", constraints: "NOT NULL" },
        { name: "role", type: "ENUM('ADMIN', 'CUSTOMER')", constraints: "NOT NULL" },
        { name: "is_active", type: "BOOLEAN", constraints: "DEFAULT TRUE" },
        { name: "last_login", type: "TIMESTAMP", constraints: "NULL" },
        { name: "failed_login_attempts", type: "INT", constraints: "DEFAULT 0" },
        { name: "account_locked_until", type: "TIMESTAMP", constraints: "NULL" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" },
        { name: "updated_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "customers",
      description: "Customer profile and KYC information",
      columns: [
        { name: "customer_id", type: "BIGINT", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "user_id", type: "BIGINT", constraints: "FOREIGN KEY REFERENCES users(user_id)" },
        { name: "first_name", type: "VARCHAR(50)", constraints: "NOT NULL" },
        { name: "last_name", type: "VARCHAR(50)", constraints: "NOT NULL" },
        { name: "date_of_birth", type: "DATE", constraints: "NOT NULL" },
        { name: "gender", type: "ENUM('MALE', 'FEMALE', 'OTHER')", constraints: "NOT NULL" },
        { name: "phone_number", type: "VARCHAR(15)", constraints: "UNIQUE, NOT NULL" },
        { name: "address_line1", type: "VARCHAR(255)", constraints: "NOT NULL" },
        { name: "address_line2", type: "VARCHAR(255)", constraints: "NULL" },
        { name: "city", type: "VARCHAR(100)", constraints: "NOT NULL" },
        { name: "state", type: "VARCHAR(100)", constraints: "NOT NULL" },
        { name: "postal_code", type: "VARCHAR(10)", constraints: "NOT NULL" },
        { name: "country", type: "VARCHAR(100)", constraints: "DEFAULT 'India'" },
        { name: "kyc_status", type: "ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED')", constraints: "DEFAULT 'PENDING'" },
        { name: "kyc_documents", type: "JSON", constraints: "NULL" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" },
        { name: "updated_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "accounts",
      description: "Bank account information",
      columns: [
        { name: "account_id", type: "BIGINT", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "account_number", type: "VARCHAR(20)", constraints: "UNIQUE, NOT NULL" },
        { name: "customer_id", type: "BIGINT", constraints: "FOREIGN KEY REFERENCES customers(customer_id)" },
        { name: "account_type", type: "ENUM('SAVINGS', 'CURRENT', 'FIXED_DEPOSIT')", constraints: "NOT NULL" },
        { name: "balance", type: "DECIMAL(15,2)", constraints: "DEFAULT 0.00" },
        { name: "minimum_balance", type: "DECIMAL(10,2)", constraints: "DEFAULT 0.00" },
        { name: "interest_rate", type: "DECIMAL(5,4)", constraints: "DEFAULT 0.0000" },
        { name: "status", type: "ENUM('ACTIVE', 'INACTIVE', 'CLOSED', 'FROZEN')", constraints: "DEFAULT 'ACTIVE'" },
        { name: "opening_date", type: "DATE", constraints: "NOT NULL" },
        { name: "closing_date", type: "DATE", constraints: "NULL" },
        { name: "branch_code", type: "VARCHAR(10)", constraints: "NOT NULL" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" },
        { name: "updated_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "transactions",
      description: "All banking transactions",
      columns: [
        { name: "transaction_id", type: "BIGINT", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "transaction_reference", type: "VARCHAR(50)", constraints: "UNIQUE, NOT NULL" },
        { name: "account_id", type: "BIGINT", constraints: "FOREIGN KEY REFERENCES accounts(account_id)" },
        { name: "transaction_type", type: "ENUM('DEBIT', 'CREDIT')", constraints: "NOT NULL" },
        { name: "amount", type: "DECIMAL(15,2)", constraints: "NOT NULL" },
        { name: "balance_after", type: "DECIMAL(15,2)", constraints: "NOT NULL" },
        { name: "description", type: "VARCHAR(255)", constraints: "NOT NULL" },
        { name: "transaction_mode", type: "ENUM('CASH', 'CHEQUE', 'ONLINE', 'TRANSFER', 'ATM')", constraints: "NOT NULL" },
        { name: "reference_number", type: "VARCHAR(100)", constraints: "NULL" },
        { name: "beneficiary_account", type: "VARCHAR(20)", constraints: "NULL" },
        { name: "beneficiary_name", type: "VARCHAR(100)", constraints: "NULL" },
        { name: "status", type: "ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED')", constraints: "DEFAULT 'COMPLETED'" },
        { name: "created_by", type: "BIGINT", constraints: "FOREIGN KEY REFERENCES users(user_id)" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "fixed_deposits",
      description: "Fixed deposit account details",
      columns: [
        { name: "fd_id", type: "BIGINT", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "fd_number", type: "VARCHAR(20)", constraints: "UNIQUE, NOT NULL" },
        { name: "customer_id", type: "BIGINT", constraints: "FOREIGN KEY REFERENCES customers(customer_id)" },
        { name: "principal_amount", type: "DECIMAL(15,2)", constraints: "NOT NULL" },
        { name: "interest_rate", type: "DECIMAL(5,4)", constraints: "NOT NULL" },
        { name: "tenure_months", type: "INT", constraints: "NOT NULL" },
        { name: "maturity_amount", type: "DECIMAL(15,2)", constraints: "NOT NULL" },
        { name: "start_date", type: "DATE", constraints: "NOT NULL" },
        { name: "maturity_date", type: "DATE", constraints: "NOT NULL" },
        { name: "status", type: "ENUM('ACTIVE', 'MATURED', 'PREMATURE_CLOSURE')", constraints: "DEFAULT 'ACTIVE'" },
        { name: "nomination_details", type: "JSON", constraints: "NULL" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" },
        { name: "updated_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "interest_postings",
      description: "Interest calculation and posting records",
      columns: [
        { name: "posting_id", type: "BIGINT", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "account_id", type: "BIGINT", constraints: "FOREIGN KEY REFERENCES accounts(account_id)" },
        { name: "posting_date", type: "DATE", constraints: "NOT NULL" },
        { name: "interest_amount", type: "DECIMAL(10,2)", constraints: "NOT NULL" },
        { name: "balance_for_calculation", type: "DECIMAL(15,2)", constraints: "NOT NULL" },
        { name: "interest_rate_applied", type: "DECIMAL(5,4)", constraints: "NOT NULL" },
        { name: "days_calculated", type: "INT", constraints: "NOT NULL" },
        { name: "status", type: "ENUM('CALCULATED', 'POSTED')", constraints: "DEFAULT 'CALCULATED'" },
        { name: "transaction_id", type: "BIGINT", constraints: "FOREIGN KEY REFERENCES transactions(transaction_id), NULL" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "audit_logs",
      description: "System audit trail",
      columns: [
        { name: "log_id", type: "BIGINT", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "user_id", type: "BIGINT", constraints: "FOREIGN KEY REFERENCES users(user_id)" },
        { name: "action", type: "VARCHAR(100)", constraints: "NOT NULL" },
        { name: "resource_type", type: "VARCHAR(50)", constraints: "NOT NULL" },
        { name: "resource_id", type: "VARCHAR(50)", constraints: "NOT NULL" },
        { name: "old_values", type: "JSON", constraints: "NULL" },
        { name: "new_values", type: "JSON", constraints: "NULL" },
        { name: "ip_address", type: "VARCHAR(45)", constraints: "NULL" },
        { name: "user_agent", type: "TEXT", constraints: "NULL" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Database Schema Design</h2>
        <p className="text-muted-foreground">
          Comprehensive database schema for the Core Banking System
        </p>
      </div>
      
      <div className="grid gap-6">
        {tables.map((table, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                {table.name}
              </CardTitle>
              <CardDescription>{table.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Column Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Data Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Constraints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns.map((column, colIdx) => (
                      <tr key={colIdx} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-mono text-sm">
                          {column.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-mono text-sm">
                          {column.type}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          {column.constraints}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DatabaseSchema;
