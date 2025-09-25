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
      "The generated avatar image as a data URI, including a MIME type and Base64 encoding."
    ),
});
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

export async function generateAvatar(
  input: GenerateAvatarInput
): Promise<GenerateAvatarOutput> {
  return generateAvatarFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAvatarPrompt',
  input: { schema: GenerateAvatarInputSchema },
  output: { schema: GenerateAvatarOutputSchema },
  prompt: `You are an expert digital artist who creates stylized avatars from photos.

  Transform the following photo into a high-quality, artistic avatar in the specified style. The avatar should be a headshot, focusing on the face, and maintain the key features of the person in the photo while creatively interpreting it in the chosen style.

  Style: {{{style}}}
  Photo: {{media url=photoDataUri}}

  Output the generated image as a data URI.`,
  config: {
    responseModalities: ['IMAGE', 'TEXT'],
  },
  model: 'googleai/gemini-2.5-flash-image-preview',
});

const generateAvatarFlow = ai.defineFlow(
  {
    name: 'generateAvatarFlow',
    inputSchema: GenerateAvatarInputSchema,
    outputSchema: GenerateAvatarOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);

    if (!output?.media) {
        throw new Error('Avatar generation failed: No image was returned from the model.');
    }
    
    return {
        avatarDataUri: output.media.url
    };
  }
);
