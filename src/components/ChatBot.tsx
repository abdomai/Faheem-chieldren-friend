import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { chatWithAI } from '@/services/openai';
import { toast } from "sonner";

type Message = {
  text: string;
  isUser: boolean;
  timestamp: Date;
};

const botResponses = [
  "سؤال رائع! عاشت الديناصورات منذ ملايين السنين وكان لبعضها ريش!",
  "أنا أحب الرسم أيضًا! هل تعلم أن بعض أقدم اللوحات رسمها أناس عاشوا في الكهوف؟",
  "الفضاء مذهل! هناك مليارات النجوم في مجرتنا!",
  "أعتقد أن وحيد القرن هو حصان سحري له قرن على رأسه!",
  "تبدأ الفراشات كيرقات قبل أن تنمو أجنحتها الجميلة!",
  "المحيط عميق جدًا! بعض الأسماك تعيش في أعماق بحيث تصنع ضوءها بنفسها!",
  "حيواني المفضل هو الدب! ما هو حيوانك المفضل؟",
  "هل تعلم أن الأشجار يمكنها التواصل مع بعضها البعض عبر الجذور؟",
  "نكتة: من يطرق الباب؟ بقرة مقاطعة! بقرة مقاطعة مـ... مووو!",
  "إذا مزجت اللون الأحمر مع الأزرق ستحصل على اللون البنفسجي!",
  "يبدو القمر مختلفًا كل ليلة لأننا نرى أجزاء مختلفة منه مضاءة بالشمس!",
];

const chatStarters = [
  "أخبرني عن الديناصورات!",
  "أحب الرسم!",
  "ماذا يوجد في الفضاء؟",
  "ما هو وحيد القرن؟",
  "كيف تنمو الفراشات؟",
  "أخبرني عن المحيط!",
  "ما هو حيوانك المفضل؟",
  "أخبرني حقيقة ممتعة!",
  "أخبرني نكتة!",
];

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "مرحبًا! أنا صديقك الروبوت! عن ماذا تريد أن نتحدث اليوم؟",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await chatWithAI(input);
      
      const botMessage = {
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error("عذرًا، حدث خطأ أثناء المحادثة. يرجى المحاولة مرة أخرى.", {
        icon: "❌",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };
  
  const useStarter = (starter: string) => {
    setInput(starter);
  };
  
  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto bg-blue-100 p-4 rounded-3xl backdrop-blur-sm shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <MessageCircle size={24} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-blue-900">دردش مع الروبوت</h2>
      </div>
      
      {/* Chat suggestions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {chatStarters.slice(0, 4).map((starter, index) => (
          <button
            key={index}
            className="bg-kidsLavender/70 hover:bg-kidsLavender px-3 py-1 rounded-full text-lg font-medium transition-colors"
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
              className={`max-w-[80%] p-3 rounded-xl text-lg ${
                message.isUser
                  ? 'bg-kidsBlue text-black rounded-tr-none'
                  : 'bg-blue-200 text-black rounded-tl-none'
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
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-blue-200 text-black rounded-xl p-3 rounded-tl-none">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب رسالتك..."
          className="bg-white/80 border-kidsBlue focus-visible:ring-kidsBlue text-lg"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading}
          className="bg-kidsBlue hover:bg-kidsBlue/80 text-black text-lg"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatBot;
