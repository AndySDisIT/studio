'use client';

import { mockPosts } from '@/lib/data';
import { mockUsers } from '@/lib/data';
import type { Post, User } from '@/lib/types';
import { Card, CardHeader } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

function PostCard({ post, user }: { post: Post; user?: User }) {
  if (!user) return null;

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person portrait" />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
        <div className="w-full">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{post.content}</p>
        </div>
      </CardHeader>
    </Card>
  );
}

export function MessageBoard() {
  const postsWithUsers = mockPosts.map(post => ({
    post,
    user: mockUsers.find(user => user.id === post.userId),
  }));

  return (
    <div className="h-full flex flex-col gap-2">
       <div className="flex-1 min-h-0">
        <ScrollArea className="h-full pr-4">
            <div className="flex flex-col gap-3">
            {postsWithUsers.map(({ post, user }) => (
                <PostCard key={post.id} post={post} user={user} />
            ))}
            </div>
        </ScrollArea>
       </div>
        <div className="flex gap-2">
            <Input placeholder="Type your message..." className="bg-card/80 backdrop-blur-sm border-border focus-visible:ring-primary" />
            <Button>
                <Send className="size-4" />
            </Button>
        </div>
    </div>
  );
}
