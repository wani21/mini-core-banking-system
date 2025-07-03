
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, CreditCard, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Account {
  accountId: number;
  accountNumber: string;
  accountType: string;
  balance: number;
  status: string;
  openedDate: string;
}

interface AccountsListProps {
  onCreateAccount: () => void;
  onSelectAccount: (account: Account) => void;
}

const AccountsList: React.FC<AccountsListProps> = ({ onCreateAccount, onSelectAccount }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAccounts();
  }, []);

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
        description: "Failed to fetch accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'SAVINGS':
        return <Wallet className="h-5 w-5" />;
      case 'CHECKING':
        return <CreditCard className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-yellow-100 text-yellow-800';
      case 'FROZEN':
        return 'bg-red-100 text-red-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Accounts</h2>
        <Button onClick={onCreateAccount} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Account
        </Button>
      </div>

      {accounts.length === 0 ? (
        <Card>
          <CardContent className="text-center p-8">
            <p className="text-muted-foreground mb-4">No accounts found</p>
            <Button onClick={onCreateAccount} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Your First Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.map((account) => (
            <Card key={account.accountId} className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onSelectAccount(account)}>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {getAccountTypeIcon(account.accountType)}
                  {account.accountType.replace('_', ' ')}
                </CardTitle>
                <Badge className={getStatusColor(account.status)}>
                  {account.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${account.balance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Account: {account.accountNumber}
                </p>
                <p className="text-xs text-muted-foreground">
                  Opened: {new Date(account.openedDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountsList;
