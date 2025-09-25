'use client';

import { useState, useMemo } from 'react';
import Map, { Marker } from 'react-map-gl';
import { motion, AnimatePresence } from 'framer-motion';
import type { User, Realm, VeilModeSettings } from '@/lib/types';
import { mockUsers } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfileCard } from './user-profile-card';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { realmInfoMap } from './icons';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapViewProps {
  activeRealm: Realm;
  veilMode: VeilModeSettings;
}

export function MapView({ activeRealm, veilMode }: MapViewProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const realmInfo = realmInfoMap[activeRealm];

  const filteredUsers = useMemo(() => {
    if (activeRealm === 'Ghost') {
      return mockUsers;
    }
    return mockUsers.filter((user) => user.realm.includes(activeRealm));
  }, [activeRealm]);

  const getFuzzedPosition = (user: User) => {
    if (!veilMode.fuzzLocation) {
      return { longitude: user.position.y, latitude: user.position.x };
    }
    // Simple deterministic fuzzing for consistent UI
    const fuzzFactor = (user.id % 5) * 0.001 - 0.002; // Small offset
    return {
      longitude: user.position.y + fuzzFactor,
      latitude: user.position.x + fuzzFactor,
    };
  };

  const initialViewState = {
    longitude: -81.0912,
    latitude: 32.0835,
    zoom: 13,
  };

  return (
    <TooltipProvider>
      <div className="relative h-full w-full bg-gray-900/50 dark:bg-black/80 overflow-hidden border border-border rounded-lg">
        <Map
          initialViewState={initialViewState}
          style={{ width: '100%', height: '100%' }}
          mapStyle={realmInfo.mapStyle}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          attributionControl={false}
        >
          <AnimatePresence>
            {filteredUsers.map((user) => {
              const position = getFuzzedPosition(user);
              return (
                <Marker
                  key={user.id}
                  longitude={position.longitude}
                  latitude={position.latitude}
                  anchor="center"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => setSelectedUser(user)}>
                          <Avatar
                            className={cn(
                              'h-12 w-12 border-4 shadow-lg transition-all duration-300 hover:scale-110',
                              veilMode.blurAvatars && 'blur-sm',
                              realmInfo.borderColor
                            )}
                          >
                            <AvatarImage
                              src={user.avatar}
                              alt={user.name}
                              data-ai-hint="person portrait"
                            />
                            <AvatarFallback>{user.initials}</AvatarFallback>
                          </Avatar>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{veilMode.hideNames ? user.initials : user.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                </Marker>
              );
            })}
          </AnimatePresence>
        </Map>
        <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <realmInfo.Icon className={cn('size-5', realmInfo.color)} />
            {realmInfo.name} Realm
          </h2>
        </div>
      </div>

      <UserProfileCard
        user={selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
        veilMode={veilMode}
        activeRealm={activeRealm}
      />
    </TooltipProvider>
  );
}
