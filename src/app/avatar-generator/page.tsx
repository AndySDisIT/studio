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
  const [generatedOverlay, setGeneratedOverlay] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setGeneratedOverlay(null);

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
    setGeneratedOverlay(null);
    try {
      // Note: We are not sending the photo, just getting a style overlay.
      const result = await generateAvatar({
        style,
      });

      if (result.overlayDataUri) {
        setGeneratedOverlay(result.overlayDataUri);
        toast({
          title: 'Style Layer Generated!',
          description: 'Your new avatar style is ready.',
        });
      } else {
        throw new Error('The AI did not return a style layer. Please try again.');
      }
    } catch (error) {
      console.error('Error generating avatar style:', error);
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
            AI Avatar Styler
          </CardTitle>
          <CardDescription>
            Upload your photo and choose a style to generate a unique avatar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="photo-upload">1. Upload Your Photo</Label>
            <Input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {preview && (
              <div className="space-y-2">
                <Label>Your Photo</Label>
                <div className="aspect-square w-full rounded-md overflow-hidden border border-dashed">
                  <Image src={preview} alt="Uploaded preview" width={400} height={400} className="object-cover w-full h-full" />
                </div>
              </div>
            )}

            {generatedOverlay && preview && (
              <div className="space-y-2">
                  <Label>Your New Avatar</Label>
                  <div className="relative aspect-square w-full rounded-md overflow-hidden border-2 border-primary">
                      <Image src={preview} alt="User photo background" fill className="object-cover" />
                      <Image src={generatedOverlay} alt="Generated avatar style overlay" fill className="object-contain" />
                  </div>
              </div>
            )}
          </div>


          <div className="space-y-2">
            <Label htmlFor="style-select">2. Choose a Style for the Overlay</Label>
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
            {isLoading ? 'Generating Style...' : 'Generate Avatar'}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
