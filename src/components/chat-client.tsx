
'use client';

import { useState } from 'react';
import { useUser } from '@/context/user-context';
import { useLanguage } from '@/context/language-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Loader2, Send, VenetianMask } from 'lucide-react';
import { chat } from '@/ai/flows/chat-flow';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const initialMessages: Message[] = [
  {
    sender: 'bot',
    text: "Welcome to the CityZen community chat! I'm the CityZen Assistant, powered by Gemini. How can I help you be a better citizen today?",
  },
  {
    sender: 'user',
    text: "How do I get points on the leaderboard?",
  },
  {
    sender: 'bot',
    text: "Great question! You earn points for every issue you report. You can also complete the Daily Challenge on the 'Report an Issue' page for bonus points. The more you contribute, the higher you'll climb the leaderboard!",
  },
];


export function ChatClient() {
  const { user } = useUser();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
      const botResponse = await chat(input, history);
      
      const botMessage: Message = { text: botResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response from AI:', error);
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the assistant. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col flex-1">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback><VenetianMask /></AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">CityZen Assistant</p>
            <p className="text-sm text-muted-foreground">Powered by Gemini</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-[50vh] pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.sender === 'bot' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <VenetianMask />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-md rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                 <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <VenetianMask />
                    </AvatarFallback>
                  </Avatar>
                <div className="max-w-md rounded-lg p-3 bg-muted">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder={t('chat_placeholder')}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
