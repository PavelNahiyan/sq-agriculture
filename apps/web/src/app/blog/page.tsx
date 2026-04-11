'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, Calendar } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogCard, BlogCardSkeleton } from '@/components/features/blog-card';
import { useBlogPosts, useBlogCategories } from '@/hooks/use-blog';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const { data: posts, isLoading } = useBlogPosts({
    search: searchQuery || undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
  });

  const { data: categories = [] } = useBlogCategories();

  const featuredPost = posts?.[0];
  const recentPosts = posts?.filter(p => p.id !== featuredPost?.id) || [];

  const categoryNames = React.useMemo(() => {
    if (!categories || categories.length === 0) return ['All'];
    return ['All', ...categories.map(c => c.name)];
  }, [categories]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        <section className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Agricultural Blog</h1>
            <p className="text-white/80">
              Expert advice, farming tips, and the latest agricultural news
            </p>
          </div>
        </section>

        {featuredPost && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <Link href={`/blog/${featuredPost.slug}`} className="block">
                <Card className="overflow-hidden hover:shadow-xl transition-shadow md:flex">
                  <div className="relative md:w-1/2 h-64 md:h-auto">
                    <img
                      src={featuredPost.image || '/placeholder.jpg'}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                    <Badge variant="secondary" className="w-fit mb-4">
                      {featuredPost.category || 'Article'}
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {featuredPost.author.charAt(0)}
                        </div>
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(featuredPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </section>
        )}

        <section className="py-6 bg-gray-50 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {categoryNames.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary text-white'
                        : 'bg-white border hover:border-primary hover:text-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-6">Latest Articles</h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            ) : recentPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-500">Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <BlogCard 
                    key={post.id} 
                    post={{
                      id: post.id,
                      title: post.title,
                      titleBn: post.titleBn,
                      slug: post.slug,
                      excerpt: post.excerpt || '',
                      excerptBn: post.excerptBn,
                      image: post.image,
                      author: post.author || 'SQ Agriculture',
                      authorImage: post.authorImage,
                      category: post.category || 'Article',
                      tags: post.tags,
                      createdAt: post.createdAt,
                    }} 
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <Card className="bg-primary text-white border-0">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Get the latest farming tips, agricultural news, and expert advice delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    placeholder="Enter your email"
                    className="bg-white text-gray-900"
                    type="email"
                  />
                  <Button variant="secondary">Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
