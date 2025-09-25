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
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const [activeRealm, setActiveRealm] = useState<Realm>('Social');
  const [veilMode, setVeilMode] = useState<VeilModeSettings>({
    blurAvatars: false,
    hideNames: false,
    fuzzLocation: false,
  });

  return (
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
      <Toaster />
    </SidebarProvider>
  );
}
