'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard, ProductCardSkeleton } from '@/components/features/product-card';
import { useAuth } from '@/hooks/use-auth';
import { useWishlist, useRemoveFromWishlist } from '@/hooks/use-wishlist';

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: wishlist, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/wishlist');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const items = wishlist || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        </div>

        {items.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 text-center mb-6">
                Save products you like to view them later
              </p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-gray-600 mb-6">{items.length} item{items.length !== 1 ? 's' : ''} in your wishlist</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} className="relative">
                  <ProductCard product={item.product!} />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeFromWishlist.mutate(item.productId)}
                    disabled={removeFromWishlist.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
