import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DrawingCanvas from '@/components/DrawingCanvas';
import ImageUpload from '@/components/ImageUpload';
import ChatBot from '@/components/ChatBot';
import Mascot from '@/components/Mascot';
import { Pencil, Image, MessageCircle } from 'lucide-react';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("draw");
  
  // Update mascot message based on active tab
  const getMascotMessage = () => {
    switch (activeTab) {
      case "draw":
        return "هيا نرسم شيئًا رائعًا! استخدم العصا السحرية للنجوم!";
      case "upload":
        return "أرني صورك! أود أن أرى ما لديك!";
      case "chat":
        return "هل لديك أي أسئلة؟ أنا هنا للدردشة معك!";
      default:
        return "هيا نبدع معًا!";
    }
  };
  
  return (
    <div className="container px-4 py-8 mx-auto">
      <header className="flex flex-col md:flex-row items-center justify-between mb-10">
        <div className="w-32 order-1 md:order-1">
          <Mascot message={getMascotMessage()} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 md:mb-0 text-center md:text-right order-2 md:order-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-transparent bg-clip-text">
          فهيـــــم
        </h1>
      </header>
      
      <Tabs
        defaultValue="draw"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mb-12"
      >
        <TabsList className="grid w-full grid-cols-3 h-auto gap-4 bg-transparent">
          <TabsTrigger
            value="draw"
            className="data-[state=active]:bg-kidsPink data-[state=active]:text-black py-6 shadow-lg rounded-xl"
          >
            <div className="flex flex-col items-center gap-1">
              <Pencil size={24} />
              <span>ارسم</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger
            value="upload"
            className="data-[state=active]:bg-kidsBlue data-[state=active]:text-black py-6 shadow-lg rounded-xl"
          >
            <div className="flex flex-col items-center gap-1">
              <Image size={24} />
              <span>صور</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger
            value="chat"
            className="data-[state=active]:bg-kidsGreen data-[state=active]:text-black py-6 shadow-lg rounded-xl"
          >
            <div className="flex flex-col items-center gap-1">
              <MessageCircle size={24} />
              <span>دردشة</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-8">
          <TabsContent value="draw" className="focus-visible:outline-none focus-visible:ring-0">
            <DrawingCanvas />
          </TabsContent>
          
          <TabsContent value="upload" className="focus-visible:outline-none focus-visible:ring-0">
            <ImageUpload />
          </TabsContent>
          
          <TabsContent value="chat" className="focus-visible:outline-none focus-visible:ring-0">
            <ChatBot />
          </TabsContent>
        </div>
      </Tabs>
      
      <footer className="text-center mt-8 text-gray-700 text-sm">
        <p>صُنع بحب للأطفال في كل مكان!</p>
        <p className="mt-1">كل الرسومات والإبداعات رائعة!</p>
      </footer>
    </div>
  );
};

export default Index;
