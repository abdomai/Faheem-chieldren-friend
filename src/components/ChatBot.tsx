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
  "!هذا سؤال رائع! عاش الديناصورات منذ ملايين السنين وكان لبعضهم ريش",
  "!أنا أحب الرسم أيضًا! هل تعلم أن بعض أقدم اللوحات رسمها أناس عاشوا في الكهوف",
  "!الفضاء رائع جدًا! هناك مليارات النجوم في مجرتنا",
  "!حسنًا، أعتقد أن وحيد القرن هو حصان سحري برأس على رأسه",
  "!الفراشات تبدأ كيرقات قبل أن تنمو أجنحتها الجميلة",
  "!المحيط عميق جدًا! بعض الأسماك تعيش في أعماق بحيث تصنع ضوءها الخاص",
  "!حيواني المفضل هو الدب! ما هو حيوانك المفضل",
  "!هل تعلم أن الأشجار يمكنها التحدث مع بعضها البعض من خلال جذورها",
  "!طرق طرق! من هناك؟ بقرة مقاطعة! بقرة مقاطعة مـ-موووو",
  "!إذا خلطت اللون الأحمر والأزرق، ستحصل على اللون البنفسجي",
];

const chatStarters = [
  "!أخبرني عن الديناصورات",
  "!أحب الرسم",
  "!ماذا يوجد في الفضاء",
  "!ما هو وحيد القرن",
  "!كيف تنمو الفراشات",
  "!أخبرني عن المحيط",
  "!ما هو حيوانك المفضل",
  "!أخبرني حقيقة ممتعة",
  "!قل لي نكتة",
];

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "!مرحبًا! أنا صديقك الروبوت! عن ماذا تريد أن نتحدث اليوم",
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
    
    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    setTimeout(() => {
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
  
  return (
    <div dir="rtl" className="flex flex-col w-full max-w-2xl mx-auto bg-white/30 p-4 rounded-3xl backdrop-blur-sm shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <MessageCircle size={24} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-blue-900">دردشة مع الروبوت</h2>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {chatStarters.slice(0, 4).map((starter, index) => (
          <button
            key={index}
            className="bg-kidsLavender/70 hover:bg-kidsLavender px-3 py-1 rounded-full text-sm font-medium transition-colors"
            onClick={() => setInput(starter)}
          >
            {starter}
          </button>
        ))}
      </div>
      
      <div className="flex-grow bg-white/70 rounded-xl p-4 h-[300px] overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-3 ${message.isUser ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-xl ${
                message.isUser
                  ? 'bg-kidsBlue text-black rounded-tl-none'
                  : 'bg-kidsYellow text-black rounded-tr-none'
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
      
      <div className="flex gap-2">
        <Button
          onClick={handleSendMessage}
          className="bg-kidsBlue hover:bg-kidsBlue/80 text-black"
        >
          <Send size={18} />
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="...اكتب رسالتك"
          className="bg-white/80 border-kidsBlue focus-visible:ring-kidsBlue text-right"
        />
      </div>
    </div>
  );
};

export default ChatBot;
