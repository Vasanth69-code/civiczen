'use server';
/**
 * @fileOverview An AI flow to analyze an image and identify its content.
 *
 * - analyzeImage - A function that handles the image analysis process.
 * - AnalyzeImageInput - The input type for the analyzeImage function.
 * - AnalyzeImageOutput - The return type for the analyzeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AnalyzeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a potential civic issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

const AnalyzeImageOutputSchema = z.string().describe("A one or two word description of the main subject of the image, such as 'pothole', 'garbage overflow', 'graffiti', 'broken streetlight', or 'other'.");
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImagePrompt',
  input: {schema: AnalyzeImageInputSchema},
  output: {schema: AnalyzeImageOutputSchema},
  prompt: `Analyze the following image of a potential civic issue. Identify the main subject. Respond with a short, two or three word description of the subject.
  
  Example responses: "pothole", "garbage overflow", "graffiti", "broken streetlight", "tree damage", "other".
  
  Photo: {{media url=photoDataUri}}`,
});

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
