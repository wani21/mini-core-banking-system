import React, { useState, useEffect } from 'react';
import AccountsList from './AccountsList';
import CreateAccountForm from './CreateAccountForm';
import TransactionForm from './TransactionForm';
import TransactionHistory from './TransactionHistory';
import SavingsOverview from './SavingsOverview';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, History, Plus, PiggyBank } from 'lucide-react';

interface Account {
  accountId: number;
  accountNumber: string;
  accountType: string;
  balance: number;
  status: string;
  openedDate: string;
}

const BankingDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<'accounts' | 'create-account' | 'transaction' | 'history' | 'savings'>('accounts');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateAccount = () => {
    setCurrentView('create-account');
  };

  const handleAccountCreated = () => {
    setCurrentView('accounts');
    setRefreshKey(prev => prev + 1);
  };

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    setCurrentView('history');
  };

  const handleNewTransaction = () => {
    setCurrentView('transaction');
  };

  const handleTransactionComplete = () => {
    setCurrentView('accounts');
    setRefreshKey(prev => prev + 1);
  };

  const handleBackToAccounts = () => {
    setCurrentView('accounts');
    setSelectedAccount(null);
  };

  const handleViewSavings = () => {
    setCurrentView('savings');
  };

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/account/my-accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  useEffect(() => {
    if (currentView === 'accounts' || currentView === 'transaction') {
      fetchAccounts();
    }
  }, [currentView, refreshKey]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {currentView === 'accounts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Banking Dashboard</h1>
              <div className="flex gap-2">
                <Button onClick={handleViewSavings} variant="outline" className="flex items-center gap-2">
                  <PiggyBank className="h-4 w-4" />
                  Savings & FD
                </Button>
                <Button onClick={handleNewTransaction} className="flex items-center gap-2">
                  <ArrowLeftRight className="h-4 w-4" />
                  New Transaction
                </Button>
              </div>
            </div>
            <AccountsList 
              key={refreshKey}
              onCreateAccount={handleCreateAccount} 
              onSelectAccount={handleSelectAccount}
            />
          </div>
        )}

        {currentView === 'create-account' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-center">Create New Account</h1>
            <CreateAccountForm 
              onAccountCreated={handleAccountCreated}
              onCancel={handleBackToAccounts}
            />
          </div>
        )}

        {currentView === 'transaction' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-center">New Transaction</h1>
            <TransactionForm 
              accounts={accounts}
              onTransactionComplete={handleTransactionComplete}
              onCancel={handleBackToAccounts}
            />
          </div>
        )}

        {currentView === 'history' && selectedAccount && (
          <TransactionHistory 
            account={selectedAccount}
            onBack={handleBackToAccounts}
          />
        )}

        {currentView === 'savings' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBackToAccounts}>
                ← Back to Accounts
              </Button>
              <h1 className="text-3xl font-bold">Savings & Fixed Deposits</h1>
            </div>
            <SavingsOverview />
          </div>
        )}
      </div>
    </div>
  );
};

export default BankingDashboard;
