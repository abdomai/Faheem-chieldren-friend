import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Image, CheckCircle, Loader2 } from 'lucide-react';
import { analyzeImage } from '@/services/openai';

const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match('image.*')) {
      toast.error("يرجى اختيار ملف صورة", {
        icon: "❌",
      });
      return;
    }

    if (file.size > 1 * 1024 * 1024) { // 1MB limit
      toast.error("الصورة كبيرة جدًا! يرجى اختيار صورة أقل من 1 ميجابايت", {
        icon: "❌",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        setImage(e.target.result);
        toast("تم رفع الصورة بنجاح!", {
          icon: "🌟",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeImage = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeImage(image);
      toast(analysis || "أرى شيئًا رائعًا في صورتك!", {
        icon: "🤖",
        duration: 10000,
        className: "text-lg font-medium",
        style: { fontSize: '1.25rem', lineHeight: '1.75rem' },
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("عذرًا، حدث خطأ أثناء تحليل الصورة. يرجى المحاولة مرة أخرى.", {
        icon: "❌",
        duration: 5000,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto bg-white/30 p-4 rounded-3xl backdrop-blur-sm shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">ارفع صورتك</h2>
      
      {!image ? (
        <div 
          className={`w-full h-64 border-4 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging ? 'border-kidsBlue bg-kidsBlue/20' : 'border-kidsLavender'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className={`transition-transform ${isDragging ? 'scale-110' : ''}`}>
            <div className="w-20 h-20 bg-kidsBlue rounded-full flex items-center justify-center mb-4 mx-auto">
              <Upload size={40} className="text-white" />
            </div>
            
            <p className="text-center font-medium">
              اسحب صورك هنا!
            </p>
            <p className="text-center text-sm text-gray-500 mt-2">
              أو اضغط لتصفح الصور
            </p>
          </div>
          
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <div className="relative w-full">
          <img 
            src={image} 
            alt="Uploaded" 
            className="max-w-full max-h-[400px] object-contain mx-auto rounded-xl shadow-md"
          />
          
          <div className="flex justify-center gap-3 mt-4">
            <Button 
              onClick={clearImage}
              className="bg-kidsLavender hover:bg-kidsLavender/80 text-black"
            >
              ارفع صورة جديدة
            </Button>
            
            <Button 
              onClick={handleAnalyzeImage}
              disabled={isAnalyzing}
              className="bg-kidsPink hover:bg-kidsPink/80 text-black flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري التحليل...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  ماذا يوجد في هذه الصورة؟
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
