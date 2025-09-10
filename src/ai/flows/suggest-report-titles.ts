'use server';

/**
 * @fileOverview AI-powered title suggestion for civic reports.
 *
 * - suggestReportTitles - A function that suggests titles for civic reports based on media and description.
 * - SuggestReportTitlesInput - The input type for the suggestReportTitles function.
 * - SuggestReportTitlesOutput - The return type for the suggestReportTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SuggestReportTitlesInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A photo, video, or audio related to the civic issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
  description: z
    .string()
    .describe('A description of the civic issue.')
    .optional(),
});
export type SuggestReportTitlesInput = z.infer<typeof SuggestReportTitlesInputSchema>;

const SuggestReportTitlesOutputSchema = z.object({
  suggestedTitle: z.string().describe('A suggested title for the civic report.'),
});
export type SuggestReportTitlesOutput = z.infer<typeof SuggestReportTitlesOutputSchema>;

export async function suggestReportTitles(
  input: SuggestReportTitlesInput
): Promise<SuggestReportTitlesOutput> {
  return suggestReportTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReportTitlesPrompt',
  input: {schema: SuggestReportTitlesInputSchema},
  output: {schema: SuggestReportTitlesOutputSchema},
  prompt: `You are an AI assistant helping users create effective titles for their civic issue reports.

  Based on the provided media (photo, video, or audio) and description, suggest a concise and informative title for the report.

  Description: {{description}}
  Media: {{#if mediaDataUri}}{{media url=mediaDataUri}}{{else}}No media provided{{/if}}

  Suggest a title that is easy to understand and accurately reflects the content of the report.
  Ensure that title does not exceed 10 words.
  If media is not provided, rely on the description to suggest a title. If description is also not provided, return "New Civic Report".`,
});

const suggestReportTitlesFlow = ai.defineFlow(
  {
    name: 'suggestReportTitlesFlow',
    inputSchema: SuggestReportTitlesInputSchema,
    outputSchema: SuggestReportTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
