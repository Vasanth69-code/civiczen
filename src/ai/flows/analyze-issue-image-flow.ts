
'use server';
/**
 * @fileOverview An AI flow to analyze an image of a civic issue.
 *
 * - analyzeIssueImage - A function that analyzes an image to identify an issue,
 *   generate a title and description, and determine if the image is fake.
 * - AnalyzeIssueImageInput - The input type for the analyzeIssueImage function.
 * - AnalyzeIssueImageOutput - The return type for the analyzeIssueImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const AnalyzeIssueImageInputSchema = z.object({
  photoUrl: z
    .string()
    .url()
    .describe(
      "A public URL to a photo of a potential civic issue."
    ),
  location: z.object({
    lat: z.number().describe("The latitude of the user's location."),
    lng: z.number().describe("The longitude of the user's location."),
  }).describe("The user's current location."),
});
export type AnalyzeIssueImageInput = z.infer<typeof AnalyzeIssueImageInputSchema>;

export const AnalyzeIssueImageOutputSchema = z.object({
    isFake: z.boolean().describe("Whether the image is likely fake, generated, a screenshot, or unrelated to a real-world civic issue."),
    issueCategory: z.string().describe("The category of the issue identified in the image. Examples: 'Pothole', 'Garbage Overflow', 'Graffiti', 'Broken Streetlight', 'Other'."),
    title: z.string().describe("A concise, descriptive title for the issue report, summarizing the problem in a few words."),
    description: z.string().describe("A detailed description of the issue, including what is shown in the image and mentioning that it is at the provided location (latitude: {{location.lat}}, longitude: {{location.lng}})."),
});
export type AnalyzeIssueImageOutput = z.infer<typeof AnalyzeIssueImageOutputSchema>;

export async function analyzeIssueImage(input: AnalyzeIssueImageInput): Promise<AnalyzeIssueImageOutput> {
  return analyzeIssueImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeIssueImagePrompt',
  input: {schema: AnalyzeIssueImageInputSchema},
  output: {schema: AnalyzeIssueImageOutputSchema},
  prompt: `You are an AI assistant for the CityZen civic reporting app. Your task is to analyze an image submitted by a user and extract information about a potential civic issue.
  
  1.  **Analyze the image's authenticity**: Determine if the image is a real-world photo. Set \`isFake\` to \`true\` if it appears to be a cartoon, a screenshot, a video game, an obviously AI-generated image, or completely irrelevant (like a selfie or a picture of a pet). Otherwise, set it to \`false\`.
  2.  **Identify the issue category**: Based on the image, classify the issue into one of the following categories: 'Pothole', 'Garbage Overflow', 'Graffiti', 'Damaged Signage', 'Streetlight Outage', 'Electrical Line Damage', 'Sewage Overflow', 'Tree Damage', 'Other'.
  3.  **Generate a title**: Create a short, clear title for the issue. For example, "Large Pothole on Road" or "Overflowing Public Dustbin".
  4.  **Generate a description**: Write a neutral, factual description of what is depicted in the image. Start by describing the main issue. Then, explicitly mention that the issue is located at the provided coordinates.
  
  **Image to analyze**: {{media url=photoUrl}}
  **Location**: Latitude: {{location.lat}}, Longitude: {{location.lng}}
  
  Provide the output in the structured format requested.`,
});

const analyzeIssueImageFlow = ai.defineFlow(
  {
    name: 'analyzeIssueImageFlow',
    inputSchema: AnalyzeIssueImageInputSchema,
    outputSchema: AnalyzeIssueImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
