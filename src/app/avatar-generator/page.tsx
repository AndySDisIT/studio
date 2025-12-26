'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { generateAvatar } from '@/ai/flows/generate-avatar';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const avatarStyles = ["Anime", "Cyberpunk", "Fantasy", "Pixel Art", "Cartoon", "3D", "Abstract", "Futuristic"];

export default function AvatarGeneratorPage() {
  const [style, setStyle] = useState<string>(avatarStyles[0]);
  const [generatedOverlay, setGeneratedOverlay] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const userPhotoUrl = 'https://picsum.photos/seed/user-selfie/400/400';

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
    setGeneratedOverlay(null);
    try {
      const result = await generateAvatar({ style });

      if (result.avatarDataUri) {
        setGeneratedOverlay(result.avatarDataUri);
        toast({
          title: 'Avatar Style Generated!',
          description: 'Your new AI-inspired style overlay is ready.',
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
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="text-primary" />
            AI Avatar Stylizer
          </CardTitle>
          <CardDescription>
            Create your &ldquo;best life&rdquo; image. We&apos;ll generate a style overlay for your photo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
                <label className="text-sm font-medium">Your Photo</label>
                <div className="relative aspect-square w-full rounded-md overflow-hidden border-2 border-dashed flex items-center justify-center">
                    <Image src={userPhotoUrl} alt="Your selfie" layout="fill" className="object-cover" data-ai-hint="person selfie"/>
                </div>
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Your New Avatar</label>
                <div className="relative aspect-square w-full rounded-md overflow-hidden border-2 border-primary bg-card flex items-center justify-center">
                    {isLoading && <Loader2 className="animate-spin text-primary" />}
                    {!isLoading && !generatedOverlay && (
                      <div className="text-center text-muted-foreground p-4">
                        <Wand2 className="mx-auto mb-2" />
                        <p>Your generated avatar will appear here.</p>
                      </div>
                    )}
                    {userPhotoUrl && (
                        <Image src={userPhotoUrl} alt="Your selfie background" layout="fill" className="object-cover" data-ai-hint="person selfie"/>
                    )}
                    {generatedOverlay && (
                        <Image src={generatedOverlay} alt="Generated AI style overlay" layout="fill" className="object-cover opacity-70 mix-blend-screen" data-ai-hint="abstract overlay"/>
                    )}
                </div>
            </div>
          </div>
          
          <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>Developer Note</AlertTitle>
              <AlertDescription>
                This is a simulation of selfie-to-avatar generation. The full feature requires a more powerful AI model.
              </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <label htmlFor="style-select" className="text-sm font-medium">1. Choose a Style</label>
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
            {isLoading ? 'Generating Style...' : 'Generate Avatar Style'}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
