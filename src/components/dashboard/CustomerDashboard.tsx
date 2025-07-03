
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, FileCheck, AlertCircle, CheckCircle } from 'lucide-react';
import CustomerProfileForm from './CustomerProfileForm';

interface CustomerProfile {
  customerId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  kycStatus: string;
}

interface CustomerDashboardProps {
  user: any;
  onLogout: () => void;
}

const CustomerDashboard = ({ user, onLogout }: CustomerDashboardProps) => {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/customer/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
      } else if (response.status === 400) {
        // No profile exists yet
        setShowProfileForm(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  const getKycStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'IN_PROGRESS':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'REJECTED':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileCheck className="w-4 h-4 text-gray-500" />;
    }
  };

  const getKycStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'default';
      case 'IN_PROGRESS':
        return 'secondary';
      case 'REJECTED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (showProfileForm || !profile) {
    return (
      <CustomerProfileForm 
        onProfileCreated={(newProfile) => {
          setProfile(newProfile);
          setShowProfileForm(false);
          toast({
            title: "Profile Created",
            description: "Your customer profile has been created successfully!",
          });
        }}
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.username}</p>
        </div>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Your registered details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold">Name</p>
              <p className="text-muted-foreground">{profile.firstName} {profile.lastName}</p>
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <div>
              <p className="font-semibold">Phone</p>
              <p className="text-muted-foreground">{profile.phoneNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Date of Birth</p>
              <p className="text-muted-foreground">{profile.dateOfBirth}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              KYC Status
            </CardTitle>
            <CardDescription>Your verification status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              {getKycStatusIcon(profile.kycStatus)}
              <Badge variant={getKycStatusVariant(profile.kycStatus)}>
                {profile.kycStatus.replace('_', ' ')}
              </Badge>
            </div>
            {profile.kycStatus === 'PENDING' && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Your KYC verification is pending. Please upload your documents to complete the process.
                </p>
                <Button size="sm">Upload Documents</Button>
              </div>
            )}
            {profile.kycStatus === 'IN_PROGRESS' && (
              <p className="text-sm text-muted-foreground">
                Your documents are being reviewed. We'll notify you once the verification is complete.
              </p>
            )}
            {profile.kycStatus === 'COMPLETED' && (
              <p className="text-sm text-green-600">
                Your account is fully verified! You can now access all banking services.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>{profile.addressLine1}</p>
              {profile.addressLine2 && <p>{profile.addressLine2}</p>}
              <p>{profile.city}, {profile.state} {profile.postalCode}</p>
              <p>{profile.country}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
