'use client';

import type React from 'react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { CruizrLogo, realmList } from './icons';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { Realm, VeilModeSettings } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

interface RealmSidebarProps {
  activeRealm: Realm;
  setActiveRealm: (realm: Realm) => void;
  veilMode: VeilModeSettings;
  setVeilMode: (settings: VeilModeSettings) => void;
}

export function RealmSidebar({
  activeRealm,
  setActiveRealm,
  veilMode,
  setVeilMode,
}: RealmSidebarProps) {
  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <CruizrLogo className="size-8 text-primary" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tight">Cruizr</h2>
            <p className="text-xs text-muted-foreground">
              Find your connection.
            </p>
          </div>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarMenu>
          {realmList.map(({ name, Icon, color, description }) => (
            <SidebarMenuItem key={name}>
              <SidebarMenuButton
                onClick={() => setActiveRealm(name)}
                isActive={activeRealm === name}
                className="h-12"
                tooltip={{ children: name, side: 'right' }}
              >
                <Icon className={cn('size-5', color)} />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{name}</span>
                  <span className="text-xs text-muted-foreground">
                    {description}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>VeilMode™</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-4 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="blur-avatars">Blur Avatars</Label>
              <Switch
                id="blur-avatars"
                checked={veilMode.blurAvatars}
                onCheckedChange={(checked) =>
                  setVeilMode({ ...veilMode, blurAvatars: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="hide-names">Hide Names</Label>
              <Switch
                id="hide-names"
                checked={veilMode.hideNames}
                onCheckedChange={(checked) =>
                  setVeilMode({ ...veilMode, hideNames: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="fuzz-location">Fuzz Location</Label>
              <Switch
                id="fuzz-location"
                checked={veilMode.fuzzLocation}
                onCheckedChange={(checked) =>
                  setVeilMode({ ...veilMode, fuzzLocation: checked })
                }
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="px-2 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Cruizr Inc.</p>
        </div>
      </SidebarFooter>
    </>
  );
}
