import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface FixedDepositFormProps {
  accounts: Array<{ accountId: number; accountNumber: string; balance: number }>;
  onSuccess: () => void;
}

const FixedDepositForm: React.FC<FixedDepositFormProps> = ({ accounts, onSuccess }) => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAccount || !amount || !tenure) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const fdAmount = parseFloat(amount);
    if (fdAmount < 1000) {
      toast({
        title: "Error",
        description: "Minimum amount for Fixed Deposit is $1000",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/fixed-deposit/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: parseInt(selectedAccount),
          amount: fdAmount,
          tenureMonths: parseInt(tenure)
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Fixed Deposit created successfully",
        });
        setSelectedAccount('');
        setAmount('');
        setTenure('');
        onSuccess();
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Failed to create Fixed Deposit",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create Fixed Deposit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateMaturityAmount = () => {
    if (!amount || !tenure) return 0;
    const principal = parseFloat(amount);
    const months = parseInt(tenure);
    // Simple interest calculation at 7% per annum
    const rate = 0.07;
    const interest = (principal * rate * months) / 12;
    return principal + interest;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Fixed Deposit</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="account">Select Account</Label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.accountId} value={account.accountId.toString()}>
                    {account.accountNumber} - Balance: ${account.balance.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount (Min: $1000)</Label>
            <Input
              id="amount"
              type="number"
              min="1000"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div>
            <Label htmlFor="tenure">Tenure (Months)</Label>
            <Select value={tenure} onValueChange={setTenure}>
              <SelectTrigger>
                <SelectValue placeholder="Select tenure" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 Months (6% p.a.)</SelectItem>
                <SelectItem value="12">12 Months (7% p.a.)</SelectItem>
                <SelectItem value="24">24 Months (8% p.a.)</SelectItem>
                <SelectItem value="36">36 Months (9% p.a.)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {amount && tenure && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Maturity Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Principal Amount:</span>
                  <span>${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maturity Amount:</span>
                  <span className="font-medium">${calculateMaturityAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Earned:</span>
                  <span className="text-green-600">
                    ${(calculateMaturityAmount() - parseFloat(amount)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Fixed Deposit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FixedDepositForm;