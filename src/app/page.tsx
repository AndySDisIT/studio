'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CruizrLogo } from '@/components/cruizr/icons';
import { Chrome } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication logic
    router.push('/dashboard');
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/seed/loginbg/1920/1080"
          alt="Abstract background"
          fill
          className="object-cover opacity-20"
          data-ai-hint="abstract dark"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>
      <Card className="relative z-10 w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex justify-center">
            <CruizrLogo className="size-16 text-primary" />
          </div>
          <CardTitle className="text-3xl">Welcome to Cruizr</CardTitle>
          <CardDescription>Find your connection. Sign in to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard')}>
            <Chrome className="mr-2" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
