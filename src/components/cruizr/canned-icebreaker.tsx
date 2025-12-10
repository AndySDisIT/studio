'use client';

import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const cannedQuestions = [
  'Here or your place?',
  'What are you into?',
  'Looking for now?',
  'Are you hosting?',
  'Pics?',
];

export function CannedIcebreaker() {
  const { toast } = useToast();

  const handleSendMessage = (question: string) => {
    // This is a placeholder for sending a message.
    // In a real app, this would trigger a DM.
    console.log(`Sending message: ${question}`);
    toast({
      title: 'Message Sent',
      description: `"${question}"`,
    });
  };

  return (
    <div className="w-full">
      <h4 className="font-semibold text-lg mb-3 text-center">Break the Ice</h4>
      <div className="flex flex-col space-y-2">
        {cannedQuestions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => handleSendMessage(question)}
            className="justify-start"
          >
            <MessageSquarePlus className="mr-2" />
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
}
