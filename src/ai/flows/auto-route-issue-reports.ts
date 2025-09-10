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
  issueType: z.string().describe('The type of civic issue reported.'),
  department: z
    .string()
    .describe('The department to which the issue should be routed.'),
  priority: z.string().describe('The priority of the issue (e.g., high, medium, low).'),
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
