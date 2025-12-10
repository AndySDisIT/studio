import {
  Handshake,
  Sprout,
  HeartHandshake,
  Flame,
  PartyPopper,
  Ghost,
  type LucideIcon,
  LifeBuoy,
} from 'lucide-react';
import type { Realm, RealmInfo } from '@/lib/types';

export const CruizrLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 4.17 4.42 9.92 6.24 12.11.4.48 1.13.48 1.53 0C14.58 18.92 19 13.17 19 9c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

export const realmInfoMap: Record<Realm, RealmInfo> = {
  Connect: {
    name: 'Connect',
    Icon: LifeBuoy,
    color: 'text-blue-400',
    borderColor: 'border-blue-400',
    description: 'Jobs, networking, and personal growth',
    mapStyle: 'mapbox://styles/mapbox/streets-v12',
  },
  Social: {
    name: 'Social',
    Icon: Sprout,
    color: 'text-primary',
    borderColor: 'border-primary',
    description: 'Public activities, hobby connections',
    mapStyle: 'mapbox://styles/mapbox/outdoors-v12',
  },
  Dating: {
    name: 'Dating',
    Icon: HeartHandshake,
    color: 'text-pink-400',
    borderColor: 'border-pink-400',
    description: 'Serious dating, romantic connections',
    mapStyle: 'mapbox://styles/mapbox/dark-v11',
  },
  'Hook Up': {
    name: 'Hook Up',
    Icon: Flame,
    color: 'text-red-500',
    borderColor: 'border-red-500',
    description: 'FWB, casual encounters',
    mapStyle: 'mapbox://styles/mapbox/satellite-streets-v12',
  },
  'Party/Etc': {
    name: 'Party/Etc',
    Icon: PartyPopper,
    color: 'text-purple-400',
    borderColor: 'border-purple-400',
    description: 'Group fun, kinks, and wild experiences',
    mapStyle: 'mapbox://styles/mapbox/satellite-streets-v12',
  },
  Ghost: {
    name: 'Ghost',
    Icon: Ghost,
    color: 'text-slate-400',
    borderColor: 'border-slate-400',
    description: 'Incognito browsing of all realms',
    mapStyle: 'mapbox://styles/mapbox/navigation-night-v1',
  },
};

export const realmList = Object.values(realmInfoMap);
