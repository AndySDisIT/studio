import type { LucideIcon } from 'lucide-react';

export const realms = [
  'Professional',
  'Social',
  'Dating',
  'Hook Up',
  'Party/Etc',
  'Ghost',
] as const;

export type Realm = (typeof realms)[number];

export type RealmInfo = {
  name: Realm;
  Icon: LucideIcon;
  color: string;
  borderColor: string;
  description: string;
  mapStyle: string;
};

export type User = {
  id: number;
  name: string;
  initials: string;
  realm: Realm[];
  position: { x: number; y: number }; // latitude, longitude
  avatar: string;
  profile: string;
};

export type VeilModeSettings = {
  blurAvatars: boolean;
  hideNames: boolean;
  fuzzLocation: boolean;
};

export type Post = {
  id: number;
  userId: number;
  content: string;
  timestamp: string;
};
