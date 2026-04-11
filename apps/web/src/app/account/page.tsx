'use client';

import * as React from 'react';

export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Phone, MapPin, ShoppingBag, Heart, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/account');
    }
  }, [authLoading, isAuthenticated, router]);

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600 mt-1">Manage your profile and preferences</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-700">
                          <User className="w-4 h-4 text-gray-400" />
                          {user?.name || 'Not set'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {user?.email}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+880 1XXX XXXXXX"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {user?.phone || 'Not set'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="capitalize">{user?.role?.toLowerCase() || 'Customer'}</span>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/wishlist">
                    <Button variant="ghost" className="w-full justify-start">
                      <Heart className="w-4 h-4 mr-2" />
                      My Wishlist
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="ghost" className="w-full justify-start">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Browse Products
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Security</CardTitle>
                  <CardDescription>Manage your password</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/auth/forgot-password">
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
