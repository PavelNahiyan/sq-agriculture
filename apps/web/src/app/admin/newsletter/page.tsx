'use client';

import * as React from 'react';
import { Loader2, Trash2, Mail } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useNewsletterSubscriptions, useNewsletterStats, useUnsubscribeNewsletter } from '@/hooks/use-newsletter';

export default function AdminNewsletterPage() {
  const { data: subscriptions, isLoading } = useNewsletterSubscriptions();
  const { data: stats } = useNewsletterStats();
  const unsubscribe = useUnsubscribeNewsletter();

  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  const handleUnsubscribe = async (id: string) => {
    try {
      await unsubscribe.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
            <p className="text-gray-500">Manage newsletter subscriptions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Subscribers</p>
                  <p className="text-2xl font-bold mt-1">{stats?.total || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Subscribers</p>
                  <p className="text-2xl font-bold mt-1">{stats?.active || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Subscribers ({subscriptions?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : subscriptions && subscriptions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Subscribed</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub) => (
                      <tr key={sub.id} className="border-b last:border-0">
                        <td className="py-3 px-4">{sub.email}</td>
                        <td className="py-3 px-4">
                          <Badge variant={sub.isActive ? 'default' : 'secondary'}>
                            {sub.isActive ? 'Active' : 'Unsubscribed'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(sub.subscribedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {sub.isActive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setDeleteConfirmId(sub.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No subscribers yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unsubscribe</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to unsubscribe this email?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirmId && handleUnsubscribe(deleteConfirmId)}
                disabled={unsubscribe.isPending}
              >
                {unsubscribe.isPending ? 'Processing...' : 'Unsubscribe'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
