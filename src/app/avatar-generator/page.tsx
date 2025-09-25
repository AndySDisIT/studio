'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { generateAvatar } from '@/ai/flows/generate-avatar';
import imageCompression from 'browser-image-compression';
import Image from 'next/image';

const avatarStyles = ["Anime", "Cyberpunk", "Fantasy", "Pixel Art", "Cartoon", "3D"];

export default function AvatarGeneratorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [style, setStyle] = useState<string>(avatarStyles[0]);
  const [preview, setPreview] = useState<string | null>(null);
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setGeneratedAvatar(null);

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(selectedFile, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        toast({
          variant: 'destructive',
          title: 'Image Error',
          description: 'Could not process the uploaded image.',
        });
      }
    }
  };

  const handleGenerateAvatar = async () => {
    if (!preview) {
      toast({
        variant: 'destructive',
        title: 'No Photo',
        description: 'Please upload a photo first.',
      });
      return;
    }
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
      const result = await generateAvatar({
        photoDataUri: preview,
        style,
      });

      if (result.avatarDataUri) {
        setGeneratedAvatar(result.avatarDataUri);
        toast({
          title: 'Avatar Generated!',
          description: 'Your new avatar is ready.',
        });
      } else {
        throw new Error('The AI did not return an avatar. Please try again.');
      }
    } catch (error) {
      console.error('Error generating avatar:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Avatar Generation Failed',
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
            Upload your photo and choose a style to create a unique avatar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="photo-upload">1. Upload a Photo</Label>
            <Input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {preview && (
            <div className="space-y-2">
              <Label>Your Photo</Label>
              <div className="aspect-square w-full rounded-md overflow-hidden border border-dashed">
                <Image src={preview} alt="Uploaded preview" width={400} height={400} className="object-cover w-full h-full" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="style-select">2. Choose a Style</Label>
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

          <Button onClick={handleGenerateAvatar} disabled={isLoading || !preview} className="w-full">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles className="mr-2" />
            )}
            {isLoading ? 'Generating Your Avatar...' : 'Generate Avatar'}
          </Button>

          {generatedAvatar && (
            <div className="space-y-2">
                <Label>Your New Avatar</Label>
                <div className="aspect-square w-full rounded-md overflow-hidden border-2 border-primary">
                    <Image src={generatedAvatar} alt="Generated avatar" width={400} height={400} className="object-cover w-full h-full" />
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
