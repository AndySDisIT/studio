import {
  Briefcase,
  Users,
  Heart,
  Flame,
  PartyPopper,
  Ghost,
  type LucideIcon,
  Sprout,
  Handshake,
  HeartHandshake
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
  Professional: {
    name: 'Professional',
    Icon: Handshake,
    color: 'text-blue-400',
    description: 'Business networking, career connections',
  },
  Social: {
    name: 'Social',
    Icon: Sprout,
    color: 'text-green-400',
    description: 'Public activities, hobby connections',
  },
  Dating: {
    name: 'Dating',
    Icon: HeartHandshake,
    color: 'text-yellow-400',
    description: 'Serious dating, romantic connections',
  },
  'Hook Up': {
    name: 'Hook Up',
    Icon: Flame,
    color: 'text-red-400',
    description: 'FWB, casual encounters',
  },
  'Party/Etc': {
    name: 'Party/Etc',
    Icon: PartyPopper,
    color: 'text-purple-400',
    description: 'Group fun, kinks, and wild experiences',
  },
  Ghost: {
    name: 'Ghost',
    Icon: Ghost,
    color: 'text-slate-400',
    description: 'Incognito browsing of all realms',
  },
};

export const realmList = Object.values(realmInfoMap);
