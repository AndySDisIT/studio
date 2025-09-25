'use server';
/**
 * @fileOverview AI-powered icebreaker suggestion flow.
 *
 * - suggestOptimalIcebreakers - A function that suggests conversation starters for a given realm and user context.
 * - SuggestOptimalIcebreakersInput - The input type for the suggestOptimalIcebreakers function.
 * - SuggestOptimalIcebreakersOutput - The return type for the suggestOptimalIcebreakers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalIcebreakersInputSchema = z.object({
  realm: z
    .string()
    .describe("The realm the user is currently in (e.g., 'Professional', 'Social', 'Dating', 'Hook Up', 'Party/Etc')."),
  userProfile: z.string().describe('A description of the user profile.'),
  connectionProfile: z.string().describe('A description of the potential connection profile.'),
  context: z.string().describe('Any additional context relevant to the conversation.'),
});
export type SuggestOptimalIcebreakersInput = z.infer<
  typeof SuggestOptimalIcebreakersInputSchema
>;

const SuggestOptimalIcebreakersOutputSchema = z.object({
  icebreakers: z
    .array(z.string())
    .describe('An array of suggested conversation starters.'),
});
export type SuggestOptimalIcebreakersOutput = z.infer<
  typeof SuggestOptimalIcebreakersOutputSchema
>;

export async function suggestOptimalIcebreakers(
  input: SuggestOptimalIcebreakersInput
): Promise<SuggestOptimalIcebreakersOutput> {
  return suggestOptimalIcebreakersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalIcebreakersPrompt',
  input: {schema: SuggestOptimalIcebreakersInputSchema},
  output: {schema: SuggestOptimalIcebreakersOutputSchema},
  prompt: `You are an AI assistant designed to suggest engaging conversation starters.

  Given the following information about the user, the potential connection, the realm they are in, and any additional context, suggest a list of icebreakers to start a conversation.  The icebreakers should be appropriate to the realm and context.

  User profile: {{{userProfile}}}
  Connection profile: {{{connectionProfile}}}
  Realm: {{{realm}}}
  Context: {{{context}}}

  Provide a list of icebreakers that are creative, engaging, and relevant to the provided information. The generated icebreakers should be aimed at initiating conversation and building rapport.
  Make sure the generated icebreakers are creative, and not something generic like "Hi".
  Ensure the list does not exceed 5 icebreakers.

  Output the icebreakers as a JSON array of strings.
  `,
});

const suggestOptimalIcebreakersFlow = ai.defineFlow(
  {
    name: 'suggestOptimalIcebreakersFlow',
    inputSchema: SuggestOptimalIcebreakersInputSchema,
    outputSchema: SuggestOptimalIcebreakersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
