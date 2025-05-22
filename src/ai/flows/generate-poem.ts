'use server';

/**
 * @fileOverview A personalized poem generation AI agent.
 *
 * - generatePoem - A function that handles the poem generation process.
 * - GeneratePoemInput - The input type for the generatePoem function.
 * - GeneratePoemOutput - The return type for the generatePoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePoemInputSchema = z.object({
  girlfriendName: z.string().describe('The name of your girlfriend.'),
  relationshipDetails: z
    .string()
    .describe('Details about your relationship, shared memories, and inside jokes.'),
  affectionHints: z.string().describe('Hints about your affection and feelings towards her.'),
});

export type GeneratePoemInput = z.infer<typeof GeneratePoemInputSchema>;

const GeneratePoemOutputSchema = z.object({
  poem: z.string().describe('A personalized poem for your girlfriend.'),
});

export type GeneratePoemOutput = z.infer<typeof GeneratePoemOutputSchema>;

export async function generatePoem(input: GeneratePoemInput): Promise<GeneratePoemOutput> {
  return generatePoemFlow(input);
}

const poemPrompt = ai.definePrompt({
  name: 'poemPrompt',
  input: {schema: GeneratePoemInputSchema},
  output: {schema: GeneratePoemOutputSchema},
  prompt: `You are a love poem writing assistant. Write a poem for {{girlfriendName}} based on the following information:

Relationship Details: {{{relationshipDetails}}}

Affection Hints: {{{affectionHints}}}

The poem should be heartfelt and express deep affection.`,
});

const generatePoemFlow = ai.defineFlow(
  {
    name: 'generatePoemFlow',
    inputSchema: GeneratePoemInputSchema,
    outputSchema: GeneratePoemOutputSchema,
  },
  async input => {
    const {output} = await poemPrompt(input);
    return output!;
  }
);
