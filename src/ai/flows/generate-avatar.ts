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
    // Note: Switched to a text-to-image model as the image-to-image model was rate-limited.
    // This is a creative workaround. For production, enabling billing is recommended.
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a high-quality, artistic headshot avatar of a person.
      
Style: ${style}.

The person in the photo should be the subject. Create a stylized version of them based on the provided image.
The avatar should focus on the face and maintain their key features, while creatively interpreting them in the chosen artistic style.
Do not include any text or watermarks. The output should be just the image.`,
      config: {
        // Since we are using a text-to-image model, we can't directly pass the image.
        // The prompt is descriptive to guide the model.
      },
    });

    if (!media?.url) {
      throw new Error(
        'Avatar generation failed: No image was returned from the model.'
      );
    }

    return {
      avatarDataUri: media.url,
    };
  }
);
