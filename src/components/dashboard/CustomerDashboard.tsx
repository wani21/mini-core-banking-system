
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, CreditCard, FileText, LogOut, Settings } from 'lucide-react';
import CustomerProfileForm from './CustomerProfileForm';
import BankingDashboard from '../banking/BankingDashboard';
import { useToast } from '@/hooks/use-toast';

interface User {
  username: string;
  email: string;
  role: string;
}

interface CustomerDashboardProps {
  user: User;
  onLogout: () => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [customerProfile, setCustomerProfile] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomerProfile();
    fetchAccounts();
  }, []);

  const fetchCustomerProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/customer/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomerProfile(data);
      }
    } catch (error) {
      console.error('Failed to fetch customer profile:', error);
    }
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
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Core Banking System</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.username}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{user.role}</Badge>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="banking" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Banking
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${getTotalBalance().toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">KYC Status</CardTitle>
                  <FileText className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge className={getKycStatusColor(customerProfile?.kycStatus || 'PENDING')}>
                      {customerProfile?.kycStatus || 'PENDING'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {customerProfile?.kycStatus === 'APPROVED' 
                      ? 'All documents verified'
                      : 'Complete your KYC to access all features'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{accounts.filter(acc => acc.status === 'ACTIVE').length}</div>
                  <p className="text-xs text-muted-foreground">
                    {accounts.length} total accounts
                  </p>
                </CardContent>
              </Card>
            </div>

            {!customerProfile && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-orange-900">Complete Your Profile</h3>
                      <p className="text-sm text-orange-700">
                        Please complete your customer profile to access banking services.
                      </p>
                    </div>
                    <Button onClick={() => setActiveTab('profile')} className="bg-orange-600 hover:bg-orange-700">
                      Complete Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {customerProfile && accounts.length === 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-blue-900">Create Your First Account</h3>
                      <p className="text-sm text-blue-700">
                        Get started by creating your first banking account.
                      </p>
                    </div>
                    <Button onClick={() => setActiveTab('banking')} className="bg-blue-600 hover:bg-blue-700">
                      Create Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="banking">
            <BankingDashboard />
          </TabsContent>

          <TabsContent value="profile">
            <CustomerProfileForm />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Account Information</h3>
                    <p className="text-sm text-muted-foreground">Username: {user.username}</p>
                    <p className="text-sm text-muted-foreground">Email: {user.email}</p>
                    <p className="text-sm text-muted-foreground">Role: {user.role}</p>
                  </div>
                  <div className="pt-4 border-t">
                    <Button variant="destructive" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDashboard;
