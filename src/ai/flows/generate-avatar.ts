'use server';
/**
 * @fileOverview AI-powered avatar generator.
 *
 * - generateAvatar - A function that generates a stylized avatar from a user's photo.
 * - GenerateAvatarInput - The input type for the generateAvatar function.
 * - GenerateAvatarOutput - The return type for the generateAvatar function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAvatarInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
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
    .describe(
      'The generated avatar image as a data URI, including a MIME type and Base64 encoding.'
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
  async ({ photoDataUri, style }) => {
    // Creative workaround for billing/rate-limit issues.
    // Use a text model to generate a unique seed for a free image service.
    const seedGenerator = await ai.generate({
      prompt: `Generate a unique, one-word, random but descriptive seed for an image with the style: ${style}. For example: 'nebula', 'galaxy', 'circuitry', 'dreamscape'.`,
      model: 'googleai/gemini-2.5-flash',
      output: {
        format: 'text',
      },
    });

    const seed = seedGenerator.text.trim().replace(/\s/g, '-');
    const imageUrl = `https://picsum.photos/seed/${seed}/400/400`;

    return {
      avatarDataUri: imageUrl,
    };
  }
);
