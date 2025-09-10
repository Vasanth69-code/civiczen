'use server';
/**
 * @fileOverview An AI agent that automatically categorizes and routes issue reports to the relevant department.
 *
 * - autoRouteIssueReport - A function that handles the issue report auto-routing process.
 * - AutoRouteIssueReportInput - The input type for the autoRouteIssueReport function.
 * - AutoRouteIssueReportOutput - The return type for the autoRouteIssueReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoRouteIssueReportInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('A description of the issue.'),
  location: z.string().describe('The geo-location of the issue.'),
});
export type AutoRouteIssueReportInput = z.infer<typeof AutoRouteIssueReportInputSchema>;

const AutoRouteIssueReportOutputSchema = z.object({
  issueType: z.enum([
    "Pothole",
    "Garbage Overflow",
    "Streetlight Outage",
    "Graffiti",
    "Damaged Signage",
    "Electrical Line Damage",
    "Sewage Overflow",
    "Tree Damage",
    "Other"
  ]).describe('The type of civic issue reported.'),
  department: z
    .string()
    .describe('The department to which the issue should be routed.'),
  priority: z.enum(['Low', 'Medium', 'High']).describe('The priority of the issue (e.g., High, Medium, Low).'),
});
export type AutoRouteIssueReportOutput = z.infer<typeof AutoRouteIssueReportOutputSchema>;

export async function autoRouteIssueReport(
  input: AutoRouteIssueReportInput
): Promise<AutoRouteIssueReportOutput> {
  return autoRouteIssueReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoRouteIssueReportPrompt',
  input: {schema: AutoRouteIssueReportInputSchema},
  output: {schema: AutoRouteIssueReportOutputSchema},
  prompt: `You are an AI assistant that categorizes and routes civic issue reports to the relevant department.

  Analyze the following information to determine the issue type, the appropriate department to handle the issue, and the priority of the issue.

  Here are the possible issue types: Pothole, Garbage Overflow, Streetlight Outage, Graffiti, Damaged Signage, Electrical Line Damage, Sewage Overflow, Tree Damage, Other.
  
  Based on the image and description, select the most appropriate issue type. For example:
  - A hole in the road is a "Pothole".
  - A full trash can is "Garbage Overflow".
  - A non-working street light is a "Streetlight Outage".
  - Spray paint on a wall is "Graffiti".
  - A fallen or broken street sign is "Damaged Signage".
  - A downed power line is "Electrical Line Damage".
  - Water bubbling from a manhole is "Sewage Overflow".
  - A fallen tree or large broken branch is "Tree Damage".
  - If it does not fit any category, use "Other".

  Also determine a priority (Low, Medium, High) based on public safety and urgency.

  Description: {{{description}}}
  Photo: {{media url=photoDataUri}}
  Location: {{{location}}}

  Provide the issue type, department, and priority in the output.
`,
});

const autoRouteIssueReportFlow = ai.defineFlow(
  {
    name: 'autoRouteIssueReportFlow',
    inputSchema: AutoRouteIssueReportInputSchema,
    outputSchema: AutoRouteIssueReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
