
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatInputSchema = z.object({
  message: z.string().describe('The user\'s message.'),
  history: z.string().describe('The chat history.'),
});

const ChatOutputSchema = z.string().describe('The AI\'s response.');

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `You are the CityZen Assistant, a helpful AI guide for a civic engagement app.
Your role is to answer user questions about the app, civic issues, and how to be a good citizen.
Keep your answers concise, friendly, and encouraging.

Here is the conversation history:
{{{history}}}

Here is the user's latest message:
user: {{{message}}}

Your response:`,
});

export async function chat(message: string, history: string): Promise<string> {
  const { output } = await chatPrompt({ message, history });
  return output ?? "I'm not sure how to respond to that. Can you ask another way?";
}
