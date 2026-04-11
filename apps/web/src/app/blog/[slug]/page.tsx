'use client';

import * as React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Share2, ArrowLeft, Tag, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBlogPost, useBlogPosts } from '@/hooks/use-blog';

interface BlogPostPageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { data: post, isLoading, error } = useBlogPost(params.slug);
  const { data: allPosts } = useBlogPosts();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    notFound();
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const contentLength = post.content?.split(' ').length || 0;
  const readTime = Math.ceil(contentLength / 200);

  const relatedPosts = allPosts?.filter(p => p.id !== post.id && p.category === post.category).slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        <section className="relative h-[40vh] min-h-[300px]">
          <img
            src={post.image || '/placeholder.jpg'}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8 text-white">
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <Badge variant="secondary" className="mb-4">{post.category || 'Article'}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold max-w-4xl">{post.title}</h1>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <article className="lg:col-span-2">
                <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {post.author.charAt(0)}
                    </div>
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{readTime} min read</span>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Tag className="w-4 h-4" />
                      Tags:
                    </span>
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary/10">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 mt-8">
                  <span className="text-gray-500">Share:</span>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Article
                  </Button>
                </div>
              </article>

              <aside className="space-y-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{post.author}</h3>
                        <p className="text-sm text-gray-500">Agricultural Expert</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Expert in agricultural sciences with over 15 years of experience in crop research and farming practices.
                    </p>
                  </CardContent>
                </Card>

                {relatedPosts.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relPost) => (
                        <Link key={relPost.id} href={`/blog/${relPost.slug}`}>
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex gap-4">
                              <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                {relPost.image && (
                                  <img src={relPost.image} alt={relPost.title} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div>
                                <p className="text-xs text-primary font-medium mb-1">{relPost.category}</p>
                                <h4 className="font-medium text-sm line-clamp-2 hover:text-primary">
                                  {relPost.title}
                                </h4>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
