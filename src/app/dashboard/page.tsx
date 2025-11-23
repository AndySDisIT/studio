'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { realmList, CruizrLogo } from '@/components/cruizr/icons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Realm } from '@/lib/types';
import Link from 'next/link';
import { Wand2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [selectedRealm, setSelectedRealm] = useState<Realm | null>(null);

  const handleRealmSelect = (realmName: Realm) => {
    setSelectedRealm(realmName);
    setIsExiting(true);
    setTimeout(() => {
      router.push(`/map`);
      // Note: In a real app, you'd pass the selected realm to the map page,
      // e.g., router.push(`/map?realm=${realmName}`);
      // For this prototype, we will assume the map page defaults to a realm.
    }, 500); // Match this with animation duration
  };

  const pageVariants = {
    initial: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="initial"
      animate={isExiting ? 'exit' : 'initial'}
      variants={pageVariants}
      className="flex flex-col items-center justify-center min-h-screen bg-background p-4"
    >
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex justify-center">
            <CruizrLogo className="size-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Choose Your Realm</h1>
        <p className="text-muted-foreground mt-2">Select your desired social context to begin exploring.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl">
        {realmList.map(({ name, Icon, color, description }) => (
          <Card
            key={name}
            onClick={() => handleRealmSelect(name)}
            className={cn(
              'cursor-pointer hover:shadow-lg transition-shadow duration-300 hover:border-primary/50',
              selectedRealm === name && 'border-primary ring-2 ring-primary'
            )}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <Icon className={cn('size-12 mb-4', color)} />
              <p className={cn("font-semibold text-lg", color)}>{name}</p>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </CardContent>
          </Card>
        ))}
         <Card
            className={'cursor-pointer hover:shadow-lg transition-shadow duration-300 hover:border-primary/50'}
          >
            <Link href="/avatar-generator" className="w-full h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                    <Wand2 className="size-12 mb-4 text-yellow-400" />
                    <p className="font-semibold text-lg text-yellow-400">Avatar Gen</p>
                    <p className="text-xs text-muted-foreground mt-1">Create a new avatar</p>
                </CardContent>
            </Link>
        </Card>
      </div>
    </motion.div>
  );
}
