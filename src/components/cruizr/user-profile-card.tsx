'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { realmInfoMap } from './icons';
import type { User, VeilModeSettings, Realm } from '@/lib/types';
import { IcebreakerSuggester } from './icebreaker-suggester';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface UserProfileCardProps {
  user: User | null;
  onOpenChange: (open: boolean) => void;
  veilMode: VeilModeSettings;
  activeRealm: Realm;
}

export function UserProfileCard({
  user,
  onOpenChange,
  veilMode,
  activeRealm,
}: UserProfileCardProps) {
  if (!user) return null;

  const displayName = veilMode.hideNames ? user.initials : user.name;

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <ScrollArea className="max-h-[80vh]">
          <div className="p-6">
            <DialogHeader className="items-center text-center">
              <Avatar className={cn('h-24 w-24 mb-4', veilMode.blurAvatars && 'blur-md')}>
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                  data-ai-hint="person portrait"
                />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <DialogTitle className="text-2xl">{displayName}</DialogTitle>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {user.realm.map((r) => (
                  <Badge key={r} variant="secondary">
                    {r}
                  </Badge>
                ))}
              </div>
            </DialogHeader>

            <div className="my-6 space-y-4 text-sm text-muted-foreground">
                <p className="text-center">{user.profile}</p>
            </div>

            <IcebreakerSuggester
              currentUserProfile="I am a software developer exploring new social connections on Cruizr."
              connection={user}
              realm={activeRealm}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
