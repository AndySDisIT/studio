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
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
        <div className="absolute inset-0 z-0">
            <Image
            src="https://picsum.photos/seed/provocative/1920/1080"
            alt="Provocative background"
            fill
            priority
            className="object-cover opacity-30"
            data-ai-hint="provocative nightlife"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50" />
        </div>

        <Card className="relative z-10 w-full max-w-sm border-primary/20 bg-card/80 backdrop-blur-lg">
            <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex justify-center">
                <CruizrLogo className="size-16 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tighter">Enter the Realms</CardTitle>
            <CardDescription>Your social landscape awaits.</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required className="bg-background/50"/>
                </div>
                <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required className="bg-background/50" />
                </div>
                <Button type="submit" className="w-full font-bold">
                Sign In & Explore
                </Button>
            </form>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                    Or join with
                </span>
                </div>
            </div>
            <Button variant="outline" className="w-full" onClick={(e) => handleLogin(e)}>
                <Chrome className="mr-2" />
                Sign in with Google
            </Button>
            </CardContent>
        </Card>
        <div className="absolute bottom-4 text-center text-xs text-muted-foreground/50 z-10">
            <p>By entering, you agree to our Terms of Service and Privacy Policy.</p>
            <p>&copy; {new Date().getFullYear()} Cruizr Inc. All rights reserved.</p>
        </div>
    </div>
  );
}
