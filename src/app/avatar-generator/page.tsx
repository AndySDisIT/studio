'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { generateAvatar } from '@/ai/flows/generate-avatar';
import Image from 'next/image';

const avatarStyles = ["Anime", "Cyberpunk", "Fantasy", "Pixel Art", "Cartoon", "3D", "Abstract", "Futuristic"];

export default function AvatarGeneratorPage() {
  const [style, setStyle] = useState<string>(avatarStyles[0]);
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateAvatar = async () => {
    if (!style) {
      toast({
        variant: 'destructive',
        title: 'No Style',
        description: 'Please select an avatar style.',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedAvatar(null);
    try {
      const result = await generateAvatar({ style });

      if (result.avatarDataUri) {
        setGeneratedAvatar(result.avatarDataUri);
        toast({
          title: 'Avatar Generated!',
          description: 'Your new AI-inspired avatar is ready.',
        });
      } else {
        throw new Error('The AI did not return an image. Please try again.');
      }
    } catch (error) {
      console.error('Error generating avatar:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: errorMessage,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="text-primary" />
            AI Avatar Generator
          </CardTitle>
          <CardDescription>
            Choose a style and let our AI generate a unique avatar for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {generatedAvatar && (
              <div className="space-y-2">
                  <Label>Your New Avatar</Label>
                  <div className="relative aspect-square w-full rounded-md overflow-hidden border-2 border-primary">
                      <Image src={generatedAvatar} alt="Generated AI Avatar" width={400} height={400} className="object-cover" data-ai-hint="avatar abstract" />
                  </div>
              </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="style-select">1. Choose a Style</Label>
            <Select onValueChange={setStyle} defaultValue={style}>
              <SelectTrigger id="style-select">
                <SelectValue placeholder="Select a style" />
              </SelectTrigger>
              <SelectContent>
                {avatarStyles.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleGenerateAvatar} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles className="mr-2" />
            )}
            {isLoading ? 'Generating...' : 'Generate Avatar'}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
