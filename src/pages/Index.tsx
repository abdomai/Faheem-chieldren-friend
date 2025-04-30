import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DrawingCanvas from '@/components/DrawingCanvas';
import ImageUpload from '@/components/ImageUpload';
import ChatBot from '@/components/ChatBot';
import Mascot from '@/components/Mascot';
import { Pencil, Image, MessageCircle } from 'lucide-react';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("draw");

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
    <div className="flex flex-col items-center justify-center w-full max-w-4xl p-4 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 w-full">
        {/* Mascot and Logo Section */}
        <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center md:justify-start text-center">
          <img
            src="/images/faheem.png"
            alt="فهيم"
            className="w-24 sm:w-32 mb-3 wiggle"
          />
          <Mascot message={getMascotMessage()} />
        </div>

        {/* Tabs and Content Section */}
        <div className="col-span-1 md:col-span-3 flex flex-col w-full">
          <Tabs
            defaultValue="draw"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 gap-2 bg-transparent mb-3">
              <TabsTrigger
                value="draw"
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-kidsPink/40 hover:bg-kidsPink data-[state=active]:bg-kidsPink data-[state=active]:text-black shadow-lg transition-all transform hover:scale-105 text-sm sm:text-xs"
              >
                <Pencil size={18} />
                <span className="text-xs">ارسم</span>
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-kidsBlue/40 hover:bg-kidsBlue data-[state=active]:bg-kidsBlue data-[state=active]:text-black shadow-lg transition-all transform hover:scale-105 text-sm sm:text-xs"
              >
                <Image size={18} />
                <span className="text-xs">صور</span>
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-kidsGreen/40 hover:bg-kidsGreen data-[state=active]:bg-kidsGreen data-[state=active]:text-black shadow-lg transition-all transform hover:scale-105 text-sm sm:text-xs"
              >
                <MessageCircle size={18} />
                <span className="text-xs">دردشة</span>
              </TabsTrigger>
            </TabsList>

            <div className="tab-content p-2 sm:p-3">
              <TabsContent value="draw" className="focus-visible:outline-none">
                <DrawingCanvas />
              </TabsContent>
              <TabsContent value="upload" className="focus-visible:outline-none">
                <ImageUpload />
              </TabsContent>
              <TabsContent value="chat" className="focus-visible:outline-none">
                <ChatBot />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-3 text-center text-gray-800 text-sm sm:text-lg">
        <p>صُنع بحب للأطفال في كل مكان!</p>
        <p>كل الرسومات والإبداعات رائعة!</p>
      </footer>
    </div>
  );
};

export default Index;
