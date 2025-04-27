
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from 'lucide-react';

type Message = {
  text: string;
  isUser: boolean;
  timestamp: Date;
};

const botResponses = [
  "That's a great question! Dinosaurs lived millions of years ago and some had feathers!",
  "I love drawing too! Did you know some of the earliest paintings were made by people who lived in caves?",
  "Space is super cool! There are billions of stars in our galaxy!",
  "Hmm, I think a unicorn is a magical horse with a horn on its head!",
  "Butterflies start as caterpillars before they grow their beautiful wings!",
  "The ocean is very deep! Some fish live so deep that they make their own light!",
  "My favorite animal is a bear! What's yours?",
  "Did you know that trees can talk to each other through their roots?",
  "Knock knock! Who's there? Interrupting cow! Interrupting cow w-MOOOOO!",
  "If you mix red and blue paint, you'll get purple!",
  "The moon looks different each night because we see different parts of it lit by the sun!",
];

const chatStarters = [
  "Tell me about dinosaurs!",
  "I like drawing!",
  "What's in space?", 
  "What's a unicorn?",
  "How do butterflies grow?",
  "Tell me about the ocean!",
  "What's your favorite animal?",
  "Tell me a fun fact!",
  "Tell me a joke!",
];

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! I'm your robot friend! What would you like to talk about today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    // Simulate "typing" with a short delay
    setTimeout(() => {
      // Generate a random response
      const botMessage = {
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const useStarter = (starter: string) => {
    setInput(starter);
  };
  
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto bg-white/30 p-4 rounded-3xl backdrop-blur-sm shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <MessageCircle size={24} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-blue-900">Chat with Robot</h2>
      </div>
      
      {/* Chat suggestions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {chatStarters.slice(0, 4).map((starter, index) => (
          <button
            key={index}
            className="bg-kidsLavender/70 hover:bg-kidsLavender px-3 py-1 rounded-full text-sm font-medium transition-colors"
            onClick={() => useStarter(starter)}
          >
            {starter}
          </button>
        ))}
      </div>
      
      {/* Chat messages */}
      <div className="flex-grow bg-white/70 rounded-xl p-4 h-[300px] overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-xl ${
                message.isUser
                  ? 'bg-kidsBlue text-black rounded-tr-none'
                  : 'bg-kidsYellow text-black rounded-tl-none'
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="bg-white/80 border-kidsBlue focus-visible:ring-kidsBlue"
        />
        <Button
          onClick={handleSendMessage}
          className="bg-kidsBlue hover:bg-kidsBlue/80 text-black"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatBot;
