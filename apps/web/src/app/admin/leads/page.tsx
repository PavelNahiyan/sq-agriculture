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
import { useLeads, useUpdateLead } from '@/hooks/use-leads';
import type { Lead, LeadStatus } from '@sq-agriculture/shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const leadSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST']),
  notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

export default function AdminLeadsPage() {
  const { data: leads, isLoading } = useLeads();
  const updateLead = useUpdateLead();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [editingLead, setEditingLead] = React.useState<Lead | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const filteredLeads = React.useMemo(() => {
    if (!leads) return [];
    return leads.filter((lead) => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  const handleUpdateStatus = async (data: LeadFormData) => {
    if (!editingLead) return;
    try {
      await updateLead.mutateAsync({ id: editingLead.id, data });
      setEditingLead(null);
      reset();
    } catch (error) {
      console.error('Failed to update lead:', error);
    }
  };

  const statusColors: Record<LeadStatus, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    CONTACTED: 'bg-yellow-100 text-yellow-700',
    QUALIFIED: 'bg-green-100 text-green-700',
    CONVERTED: 'bg-purple-100 text-purple-700',
    LOST: 'bg-red-100 text-red-700',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Leads</h1>
            <p className="text-gray-500">Manage customer leads and inquiries</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search leads..."
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
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredLeads.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Contact</th>
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-left py-3 px-4 font-medium">Interest</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="border-b last:border-0">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            {lead.company && (
                              <p className="text-sm text-gray-500">{lead.company}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{lead.email}</p>
                          <p className="text-sm text-gray-500">{lead.phone}</p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{lead.userType}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500 max-w-[200px] truncate">
                          {lead.productInterest || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={statusColors[lead.status]}>
                            {lead.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setEditingLead(lead);
                              reset({ status: lead.status, notes: lead.notes });
                            }}
                          >
                            Update Status
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No leads found.
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!editingLead} onOpenChange={() => setEditingLead(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Lead Status</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleUpdateStatus)} className="space-y-4">
              {editingLead && (
                <div className="space-y-2">
                  <p className="font-medium">{editingLead.name}</p>
                  <p className="text-sm text-gray-500">{editingLead.email}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  {...register('status')}
                  className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea 
                  {...register('notes')} 
                  placeholder="Add notes about this lead..." 
                  rows={4}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingLead(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateLead.isPending}>
                  {updateLead.isPending ? (
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
