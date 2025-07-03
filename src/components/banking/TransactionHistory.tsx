
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  transactionId: number;
  transactionType: string;
  amount: number;
  description: string;
  transactionDate: string;
  balanceAfter: number;
  referenceNumber: string;
  toAccountNumber?: string;
  fromAccountNumber?: string;
}

interface Account {
  accountId: number;
  accountNumber: string;
  accountType: string;
  balance: number;
  status: string;
}

interface TransactionHistoryProps {
  account: Account;
  onBack: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ account, onBack }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, [account.accountNumber, page]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/transaction/account/${account.accountNumber}?page=${page}&size=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (page === 0) {
          setTransactions(data.content);
        } else {
          setTransactions(prev => [...prev, ...data.content]);
        }
        setHasMore(!data.last);
      } else {
        const errorData = await response.text();
        toast({
          title: "Error",
          description: errorData,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshTransactions = () => {
    setPage(0);
    setTransactions([]);
    fetchTransactions();
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
      case 'TRANSFER_IN':
        return <ArrowDown className="h-4 w-4 text-green-600" />;
      case 'WITHDRAWAL':
      case 'TRANSFER_OUT':
        return <ArrowUp className="h-4 w-4 text-red-600" />;
      default:
        return <ArrowUpDown className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
      case 'TRANSFER_IN':
        return 'text-green-600';
      case 'WITHDRAWAL':
      case 'TRANSFER_OUT':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const formatTransactionType = (type: string) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Button variant="outline" onClick={onBack} className="mb-2">
            ← Back to Accounts
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Transaction History</h2>
            <p className="text-muted-foreground">
              Account: {account.accountNumber} • Balance: ${account.balance.toFixed(2)}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={refreshTransactions} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {loading && transactions.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : transactions.length === 0 ? (
        <Card>
          <CardContent className="text-center p-8">
            <p className="text-muted-foreground">No transactions found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.transactionId}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.transactionType)}
                    <div>
                      <div className="font-medium">
                        {formatTransactionType(transaction.transactionType)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.description || 'No description'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(transaction.transactionDate).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Ref: {transaction.referenceNumber}
                      </div>
                      {transaction.toAccountNumber && (
                        <div className="text-xs text-muted-foreground">
                          To: {transaction.toAccountNumber}
                        </div>
                      )}
                      {transaction.fromAccountNumber && (
                        <div className="text-xs text-muted-foreground">
                          From: {transaction.fromAccountNumber}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getTransactionColor(transaction.transactionType)}`}>
                      {transaction.transactionType.includes('OUT') || transaction.transactionType === 'WITHDRAWAL' ? '-' : '+'}
                      ${transaction.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Balance: ${transaction.balanceAfter.toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {hasMore && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={loadMore} 
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
