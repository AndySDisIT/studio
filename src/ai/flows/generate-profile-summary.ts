'use server';

/**
 * @fileOverview AI-powered profile summary generator for Cruizr, creating concise and engaging summaries based on the selected realm.
 *
 * - generateProfileSummary - A function that generates a profile summary.
 * - GenerateProfileSummaryInput - The input type for the generateProfileSummary function.
 * - GenerateProfileSummaryOutput - The return type for the generateProfileSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProfileSummaryInputSchema = z.object({
  realm: z
    .string()
    .describe("The realm the user is in (Professional, Social, Dating, Hook Up, Party/Etc, Ghost)."),
  profileData: z.string().describe("The user's profile data as a string."),
});
export type GenerateProfileSummaryInput = z.infer<
  typeof GenerateProfileSummaryInputSchema
>;

const GenerateProfileSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise and engaging summary of the user profile.'),
});
export type GenerateProfileSummaryOutput = z.infer<
  typeof GenerateProfileSummaryOutputSchema
>;

export async function generateProfileSummary(
  input: GenerateProfileSummaryInput
): Promise<GenerateProfileSummaryOutput> {
  return generateProfileSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProfileSummaryPrompt',
  input: {schema: GenerateProfileSummaryInputSchema},
  output: {schema: GenerateProfileSummaryOutputSchema},
  prompt: `You are an AI assistant designed to generate concise and engaging profile summaries for users of the Cruizr app, based on the realm they are currently in.\n\nGiven the following realm: {{{realm}}}\nAnd the following profile data: {{{profileData}}}\n\nGenerate a short, engaging, and attention-grabbing profile summary that highlights the most relevant information for potential matches in this realm. The summary should be no more than 2-3 sentences. Focus on the key aspects that would make the user stand out and encourage others to connect with them. Be creative and highlight their best qualities.
`,
});

const generateProfileSummaryFlow = ai.defineFlow(
  {
    name: 'generateProfileSummaryFlow',
    inputSchema: GenerateProfileSummaryInputSchema,
    outputSchema: GenerateProfileSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
