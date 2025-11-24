'use server';
/**
 * @fileOverview AI-powered avatar styler.
 *
 * - generateAvatar - A function that generates a stylized frame/overlay for a user's photo.
 * - GenerateAvatarInput - The input type for the generateAvatar function.
 * - GenerateAvatarOutput - The return type for the generateAvatar function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAvatarInputSchema = z.object({
  style: z
    .string()
    .describe(
      'The artistic style for the avatar frame (e.g., "Anime", "Cyberpunk", "Fantasy", "Pixel Art").'
    ),
});
export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;

const GenerateAvatarOutputSchema = z.object({
  overlayDataUri: z
    .string()
    .describe(
      'The generated stylistic overlay as a data URI, including a MIME type and Base64 encoding.'
    ),
});
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

export async function generateAvatar(
  input: GenerateAvatarInput
): Promise<GenerateAvatarOutput> {
  return generateAvatarFlow(input);
}

const generateAvatarFlow = ai.defineFlow(
  {
    name: 'generateAvatarFlow',
    inputSchema: GenerateAvatarInputSchema,
    outputSchema: GenerateAvatarOutputSchema,
  },
  async ({ style }) => {
    // This flow now generates a stylistic *overlay* to be combined with the user's photo on the client.
    // This is a creative workaround for billing/rate-limit issues on full image-to-image models.
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a transparent PNG image that acts as a stylistic frame or overlay for a person's portrait. The style should be "${style}". 
      
      For example:
      - For "Cyberpunk", create glowing neon circuitry around the edges.
      - For "Fantasy", create ethereal wisps of magic and light.
      - For "Anime", create dynamic speed lines and sparkles.
      - For "Pixel Art", create a retro 8-bit frame.
      
      The center of the image should be mostly transparent to allow the person's face to show through. Only create border elements, corner effects, or subtle transparent overlays.`,
       config: {
        // Request a square image, good for avatars.
        aspectRatio: "1:1"
      }
    });

    if (!media?.url) {
      throw new Error('The AI did not return an image. Please try again.');
    }

    return {
      overlayDataUri: media.url,
    };
  }
);
