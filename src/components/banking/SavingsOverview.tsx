
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PiggyBank, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FixedDeposit {
  fdId: number;
  fdNumber: string;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  startDate: string;
  maturityDate: string;
  maturityAmount: number;
  status: string;
}

interface InterestPosting {
  postingId: number;
  postingDate: string;
  interestAmount: number;
  calculationPeriodFrom: string;
  calculationPeriodTo: string;
  interestRate: number;
}

const SavingsOverview: React.FC = () => {
  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>([]);
  const [interestHistory, setInterestHistory] = useState<InterestPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavingsData();
  }, []);

  const fetchSavingsData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // This would be implemented when we add the controllers
      // For now, we'll use mock data
      setFixedDeposits([]);
      setInterestHistory([]);
    } catch (error) {
      console.error('Failed to fetch savings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'MATURED':
        return 'bg-blue-100 text-blue-800';
      case 'CLOSED_PREMATURELY':
        return 'bg-red-100 text-red-800';
      case 'RENEWED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDaysToMaturity = (maturityDate: string) => {
    const maturity = new Date(maturityDate);
    const today = new Date();
    const diffTime = maturity.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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
        <h2 className="text-2xl font-bold">Savings & Fixed Deposits</h2>
        <Button className="flex items-center gap-2">
          <PiggyBank className="h-4 w-4" />
          Create Fixed Deposit
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fixed-deposits">Fixed Deposits</TabsTrigger>
          <TabsTrigger value="interest-history">Interest History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total FD Amount</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${fixedDeposits.reduce((sum, fd) => sum + fd.principalAmount, 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {fixedDeposits.length} fixed deposits
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expected Maturity Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${fixedDeposits.reduce((sum, fd) => sum + (fd.maturityAmount || 0), 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total expected returns
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active FDs</CardTitle>
                <Calendar className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {fixedDeposits.filter(fd => fd.status === 'ACTIVE').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently earning interest
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fixed-deposits" className="space-y-4">
          {fixedDeposits.length === 0 ? (
            <Card>
              <CardContent className="text-center p-8">
                <PiggyBank className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No fixed deposits found</p>
                <Button>Create Your First Fixed Deposit</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {fixedDeposits.map((fd) => (
                <Card key={fd.fdId}>
                  <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg">FD #{fd.fdNumber}</CardTitle>
                    <Badge className={getStatusColor(fd.status)}>
                      {fd.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Principal Amount</p>
                        <p className="text-lg font-semibold">${fd.principalAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                        <p className="text-lg font-semibold">{fd.interestRate}% p.a.</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Maturity Date</p>
                        <p className="text-lg font-semibold">
                          {new Date(fd.maturityDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Maturity Amount</p>
                        <p className="text-lg font-semibold">${(fd.maturityAmount || 0).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {fd.status === 'ACTIVE' && (
                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Days to Maturity: {calculateDaysToMaturity(fd.maturityDate)}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Close Prematurely
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="interest-history" className="space-y-4">
          {interestHistory.length === 0 ? (
            <Card>
              <CardContent className="text-center p-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No interest postings found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {interestHistory.map((posting) => (
                <Card key={posting.postingId}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Interest Credit</p>
                        <p className="text-sm text-muted-foreground">
                          Period: {new Date(posting.calculationPeriodFrom).toLocaleDateString()} - 
                          {new Date(posting.calculationPeriodTo).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">
                          +${posting.interestAmount.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          @ {posting.interestRate}% p.a.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavingsOverview;
