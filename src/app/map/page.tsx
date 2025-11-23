'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type { Realm, VeilModeSettings } from '@/lib/types';
import { RealmSidebar } from '@/components/cruizr/realm-sidebar';
import { MapView } from '@/components/cruizr/map-view';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { realms } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function MapPageContent() {
  const searchParams = useSearchParams();
  const initialRealm = searchParams.get('realm');
  
  const isValidRealm = (realm: string | null): realm is Realm => {
    return realms.includes(realm as Realm);
  };

  const [activeRealm, setActiveRealm] = useState<Realm>(
    isValidRealm(initialRealm) ? initialRealm : 'Social'
  );

  const [veilMode, setVeilMode] = useState<VeilModeSettings>({
    blurAvatars: false,
    hideNames: false,
    fuzzLocation: false,
  });

  const pageVariants = {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
  };

  return (
    <motion.div initial="initial" animate="enter" variants={pageVariants}>
      <SidebarProvider>
        <Sidebar>
          <RealmSidebar
            activeRealm={activeRealm}
            setActiveRealm={setActiveRealm}
            veilMode={veilMode}
            setVeilMode={setVeilMode}
          />
        </Sidebar>
        <SidebarInset>
          <main className="relative h-screen w-full overflow-hidden">
            <MapView activeRealm={activeRealm} veilMode={veilMode} />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </motion.div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<MapPageSkeleton />}>
      <MapPageContent />
    </Suspense>
  );
}

function MapPageSkeleton() {
    return (
        <div className="flex h-screen w-full">
            <div className="w-64 h-full bg-card hidden md:block p-2">
                <Skeleton className="h-12 w-full mb-4" />
                <div className="space-y-2">
                    {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
                <div className="mt-auto space-y-4 p-2 absolute bottom-0 w-60">
                    <Skeleton className="h-6 w-1/2 mb-4" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
            <div className="flex-1 bg-background p-2">
                <Skeleton className="h-full w-full rounded-lg" />
            </div>
        </div>
    )
}
