'use client';

import { useState, useEffect } from 'react';
import { generateProfileSummary } from '@/ai/flows/generate-profile-summary';
import type { Realm } from '@/lib/types';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

interface ProfileSummaryGeneratorProps {
  userProfile: string;
  realm: Realm;
}

export function ProfileSummaryGenerator({
  userProfile,
  realm,
}: ProfileSummaryGeneratorProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const generateSummary = async () => {
      setIsLoading(true);
      try {
        const result = await generateProfileSummary({
          realm,
          profileData: userProfile,
        });
        if (result.summary) {
          setSummary(result.summary);
        } else {
          setSummary(userProfile); // Fallback to original profile
        }
      } catch (error) {
        console.error('Error generating profile summary:', error);
        setSummary(userProfile); // Fallback to original profile on error
        toast({
          variant: 'destructive',
          title: 'AI Error',
          description: 'Failed to generate profile summary. Showing full profile.',
        });
      }
      setIsLoading(false);
    };

    generateSummary();
  }, [realm, userProfile, toast]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  return (
    <p className="text-center italic">
        <Sparkles className="inline-block size-4 mr-2 text-primary" />
        {summary}
    </p>
  );
}
