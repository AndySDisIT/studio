'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User, Realm, VeilModeSettings } from '@/lib/types';
import { mockUsers } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfileCard } from './user-profile-card';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { realmInfoMap } from './icons';

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
      return user.position;
    }
    // Simple deterministic fuzzing for consistent UI
    const fuzzFactor = (user.id % 5) * 2 - 4; // between -4 and 4
    return {
      x: Math.max(0, Math.min(100, user.position.x + fuzzFactor)),
      y: Math.max(0, Math.min(100, user.position.y + fuzzFactor)),
    };
  };

  return (
    <TooltipProvider>
      <div className="relative h-full w-full bg-gray-900/50 dark:bg-black/80 overflow-hidden border border-border rounded-lg">
        <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <realmInfo.Icon className={cn('size-5', realmInfo.color)} />
                {activeRealm} Realm
            </h2>
        </div>
        {/* Placeholder for map background */}
        <div className="absolute inset-0 bg-grid-slate-700/[0.2] [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
        <AnimatePresence>
          {filteredUsers.map((user) => {
            const position = getFuzzedPosition(user);
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => setSelectedUser(user)}>
                      <Avatar className={cn(
                        "h-12 w-12 border-4 shadow-lg transition-all duration-300 hover:scale-110",
                        veilMode.blurAvatars && 'blur-sm',
                        realmInfo.borderColor
                      )}>
                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{user.initials}</AvatarFallback>
                      </Avatar>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{veilMode.hideNames ? user.initials : user.name}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            );
          })}
        </AnimatePresence>
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
