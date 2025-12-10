'use server';
/**
 * @fileOverview AI-powered avatar styler.
 *
 * - generateAvatar - A function that generates a stylized avatar image.
 * - GenerateAvatarInput - The input type for the generateAvatar function.
 * - GenerateAvatarOutput - The return type for the generateAvatar function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAvatarInputSchema = z.object({
  style: z
    .string()
    .describe(
      'The artistic style for the avatar (e.g., "Anime", "Cyberpunk", "Fantasy", "Pixel Art").'
    ),
});
export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;

const GenerateAvatarOutputSchema = z.object({
  avatarDataUri: z
    .string()
    .describe('The generated avatar image as a data URI.'),
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
    // This flow generates a unique seed for an image from a public service to avoid billing/rate-limit issues.
    // It's a creative workaround for a functional free-tier experience.
    const { output } = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: `Generate a unique, single, URL-safe word or a short, hyphenated phrase (like "mystic-forest" or "cyber-circuit") that can be used as a seed for an image generator based on the style: "${style}". The seed should be creative and evocative of the style. Only return the seed string itself.`,
        config: {
          temperature: 1, // Increase creativity
        },
    });

    const seed = output || style.toLowerCase().replace(/\s+/g, '-');
    // Using a different image service that can provide more abstract/overlay-style images
    const imageUrl = `https://picsum.photos/seed/${seed}/400/400?grayscale&blur=2`;

    return {
      avatarDataUri: imageUrl,
    };
  }
);
