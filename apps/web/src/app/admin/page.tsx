'use client';

import * as React from 'react';
import Link from 'next/link';
import { Package, Users, MessageSquare, TrendingUp, Eye, ArrowUpRight, ArrowDownRight, Leaf, Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminProducts } from '@/hooks/use-products';
import { useLeads, useLeadStats } from '@/hooks/use-leads';
import { useUsers } from '@/hooks/use-users';
import { useInquiries } from '@/hooks/use-inquiries';

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    CONTACTED: 'bg-yellow-100 text-yellow-700',
    QUALIFIED: 'bg-green-100 text-green-700',
    CONVERTED: 'bg-purple-100 text-purple-700',
    LOST: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

export default function AdminDashboardPage() {
  const { data: products } = useAdminProducts();
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const { data: leadStats } = useLeadStats();
  const { data: users } = useUsers();
  const { data: inquiries } = useInquiries();

  const recentLeads = leads?.slice(0, 5) || [];
  const topProducts = products?.slice(0, 5) || [];

  const stats = [
    { 
      title: 'Total Products', 
      value: products?.length || 0, 
      change: '+12%', 
      icon: Package, 
      href: '/admin/products',
      positive: true 
    },
    { 
      title: 'Total Leads', 
      value: leadStats?.total || leads?.length || 0, 
      change: '+24%', 
      icon: MessageSquare, 
      href: '/admin/leads',
      positive: true 
    },
    { 
      title: 'New Leads', 
      value: leadStats?.new || 0, 
      change: '-8%', 
      icon: TrendingUp, 
      href: '/admin/leads',
      positive: false 
    },
    { 
      title: 'Total Users', 
      value: users?.length || 0, 
      change: '0%', 
      icon: Users, 
      href: '/admin/users',
      positive: null 
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.positive === true && (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      )}
                      {stat.positive === false && (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm ${
                        stat.positive === true ? 'text-green-500' : 
                        stat.positive === false ? 'text-red-500' : 'text-gray-400'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-400">vs last month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Leads</CardTitle>
              <Link href="/admin/leads">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {leadsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : recentLeads.length > 0 ? (
                <div className="space-y-4">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No leads yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Products</CardTitle>
              <Link href="/admin/products">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            {product.category?.name || 'Uncategorized'}
                          </p>
                        </div>
                      </div>
                      {product.featured && (
                        <Badge variant="secondary" className="text-xs">Featured</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No products yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/products/new">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                  <Package className="w-5 h-5" />
                  <span className="text-xs">Add Product</span>
                </Button>
              </Link>
              <Link href="/admin/leads">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs">View Leads</span>
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                  <Leaf className="w-5 h-5" />
                  <span className="text-xs">Manage Categories</span>
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                  <Eye className="w-5 h-5" />
                  <span className="text-xs">View Website</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
