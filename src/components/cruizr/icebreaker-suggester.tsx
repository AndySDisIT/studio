'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { suggestOptimalIcebreakers } from '@/ai/flows/suggest-optimal-icebreakers';
import type { User, Realm } from '@/lib/types';
import { Sparkles, MessageSquareQuote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

interface IcebreakerSuggesterProps {
  currentUserProfile: string;
  connection: User;
  realm: Realm;
}

export function IcebreakerSuggester({
  currentUserProfile,
  connection,
  realm,
}: IcebreakerSuggesterProps) {
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggestIcebreakers = async () => {
    setIsLoading(true);
    setIcebreakers([]);
    try {
      const result = await suggestOptimalIcebreakers({
        realm,
        userProfile: currentUserProfile,
        connectionProfile: connection.profile,
        context: `The user is considering starting a conversation with ${connection.name}.`,
      });
      if (result.icebreakers && result.icebreakers.length > 0) {
        setIcebreakers(result.icebreakers);
      } else {
        toast({
          title: 'No suggestions found',
          description: 'The AI couldn\'t generate icebreakers at this time. Try again later.',
        });
      }
    } catch (error) {
      console.error('Error generating icebreakers:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate icebreakers. Please try again.',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      <Button onClick={handleSuggestIcebreakers} disabled={isLoading} className="w-full">
        <Sparkles className="mr-2" />
        {isLoading ? 'Generating...' : 'Suggest Icebreakers'}
      </Button>

      {isLoading && (
        <div className="mt-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
        </div>
      )}

      {icebreakers.length > 0 && (
        <div className="mt-4 animate-in fade-in-50">
            <h4 className="font-semibold text-lg mb-2">Conversation Starters</h4>
            <ul className="space-y-3">
              {icebreakers.map((icebreaker, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <MessageSquareQuote className="size-4 mt-1 shrink-0 text-primary" />
                  <span className="flex-1">{icebreaker}</span>
                </li>
              ))}
            </ul>
        </div>
      )}
    </div>
  );
}
