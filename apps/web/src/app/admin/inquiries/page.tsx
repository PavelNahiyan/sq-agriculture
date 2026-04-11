'use client';

import * as React from 'react';
import { Loader2, Search } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useInquiries, useUpdateInquiry } from '@/hooks/use-inquiries';
import type { Inquiry, InquiryStatus } from '@/lib/shared-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const inquirySchema = z.object({
  status: z.enum(['NEW', 'READ', 'REPLIED', 'CONVERTED', 'ARCHIVED']),
  notes: z.string().optional(),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

export default function AdminInquiriesPage() {
  const { data: inquiries, isLoading } = useInquiries();
  const updateInquiry = useUpdateInquiry();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [editingInquiry, setEditingInquiry] = React.useState<Inquiry | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  });

  const filteredInquiries = React.useMemo(() => {
    if (!inquiries) return [];
    return inquiries.filter((inquiry) => {
      const matchesSearch = 
        inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchQuery, statusFilter]);

  const handleUpdateStatus = async (data: InquiryFormData) => {
    if (!editingInquiry) return;
    try {
      await updateInquiry.mutateAsync({ id: editingInquiry.id, data });
      setEditingInquiry(null);
      reset();
    } catch (error) {
      console.error('Failed to update inquiry:', error);
    }
  };

  const statusColors: Record<InquiryStatus, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    READ: 'bg-yellow-100 text-yellow-700',
    REPLIED: 'bg-green-100 text-green-700',
    CONVERTED: 'bg-purple-100 text-purple-700',
    ARCHIVED: 'bg-gray-100 text-gray-700',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inquiries</h1>
            <p className="text-gray-500">Manage customer inquiries</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>All Inquiries ({filteredInquiries.length})</CardTitle>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search inquiries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 px-3 rounded-md border border-input bg-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="NEW">New</option>
                  <option value="READ">Read</option>
                  <option value="REPLIED">Replied</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredInquiries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Contact</th>
                      <th className="text-left py-3 px-4 font-medium">Interest</th>
                      <th className="text-left py-3 px-4 font-medium">Message</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="border-b last:border-0">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{inquiry.name}</p>
                            {inquiry.company && (
                              <p className="text-sm text-gray-500">{inquiry.company}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{inquiry.email}</p>
                          <p className="text-sm text-gray-500">{inquiry.phone}</p>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {inquiry.productInterest || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500 max-w-[200px] truncate">
                          {inquiry.message}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={statusColors[inquiry.status]}>
                            {inquiry.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setEditingInquiry(inquiry);
                              reset({ status: inquiry.status, notes: inquiry.notes });
                            }}
                          >
                            View/Update
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No inquiries found.
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!editingInquiry} onOpenChange={() => setEditingInquiry(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Inquiry Details</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleUpdateStatus)} className="space-y-4">
              {editingInquiry && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">Name</Label>
                      <p className="font-medium">{editingInquiry.name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Email</Label>
                      <p className="font-medium">{editingInquiry.email}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-500">Phone</Label>
                    <p className="font-medium">{editingInquiry.phone}</p>
                  </div>
                  {editingInquiry.productInterest && (
                    <div>
                      <Label className="text-gray-500">Product Interest</Label>
                      <p className="font-medium">{editingInquiry.productInterest}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-gray-500">Message</Label>
                    <p className="mt-1 p-3 bg-gray-50 rounded-md">{editingInquiry.message}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    {...register('status')}
                    className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                  >
                    <option value="NEW">New</option>
                    <option value="READ">Read</option>
                    <option value="REPLIED">Replied</option>
                    <option value="CONVERTED">Converted</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea 
                  {...register('notes')} 
                  placeholder="Add notes about this inquiry..." 
                  rows={4}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingInquiry(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateInquiry.isPending}>
                  {updateInquiry.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Update
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
