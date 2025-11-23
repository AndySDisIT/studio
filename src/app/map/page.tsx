'use client';

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

export default function MapPage() {
  const [activeRealm, setActiveRealm] = useState<Realm>('Social');
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
