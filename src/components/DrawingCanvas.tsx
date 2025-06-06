import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ColorPicker from './ColorPicker';
import { Wand2, Download, CheckCircle, Loader2 } from 'lucide-react';
import { analyzeDrawing } from '@/services/openai';

const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(12);
  const [sparkleMode, setSparkleMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      // Set canvas resolution to match display size, adjusted for device pixel ratio
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;

      const context = canvas.getContext('2d');
      if (context) {
        // Scale context to account for device pixel ratio
        context.scale(window.devicePixelRatio, window.devicePixelRatio);
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = brushSize;
        context.strokeStyle = color;
        setCtx(context);

        // Fill with white background
        context.fillStyle = 'white';
        context.fillRect(0, 0, rect.width, rect.height);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Update brush size and color
  useEffect(() => {
    if (ctx) {
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = color;
    }
  }, [color, brushSize, ctx]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width / window.devicePixelRatio;
    const scaleY = canvas.height / rect.height / window.devicePixelRatio;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctx) return;

    setIsDrawing(true);
    const coordinates = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(coordinates.x, coordinates.y);

    if (sparkleMode) {
      drawSparkle(coordinates.x, coordinates.y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;

    const coordinates = getCoordinates(e);

    if (sparkleMode) {
      drawSparkle(coordinates.x, coordinates.y);
    } else {
      ctx.lineTo(coordinates.x, coordinates.y);
      ctx.stroke();
    }
  };

  const endDrawing = () => {
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  const drawSparkle = (x: number, y: number) => {
    if (!ctx) return;

    const sparkleSize = brushSize / 2;
    const colors = ['#FFD700', '#FF6B6B', '#C3B1E1', '#77DD77', '#A7C7E7'];

    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * sparkleSize;
      const sparkleX = x + Math.cos(angle) * distance;
      const sparkleY = y + Math.sin(angle) * distance;

      ctx.beginPath();
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.arc(sparkleX, sparkleY, Math.random() * 3 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    const canvas = canvasRef.current;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
    toast("تم مسح اللوحة! ابدأ رسمة جديدة!", { icon: "🎨" });
  };

  const toggleSparkleMode = () => {
    setSparkleMode(!sparkleMode);
    if (!sparkleMode) {
      toast("تم تفعيل العصا السحرية! ✨ ارسم النجوم!", { icon: "✨" });
    } else {
      toast("عدنا لوضع الرسم العادي", { icon: "🖌️" });
    }
  };

  const downloadDrawing = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'my-drawing.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("تم حفظ رسمتك! 🎉", { icon: "💾" });
  };

  const handleAnalyzeDrawing = async () => {
    if (!canvasRef.current) return;

    setIsAnalyzing(true);
    try {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png');
      const analysis = await analyzeDrawing(imageData);

      toast(analysis || "واو، أرى رسمة جميلة! تبدو رائعة!", {
        icon: "🤖",
        duration: 10000,
        className: "text-lg font-medium",
        style: { fontSize: '1.25rem', lineHeight: '1.75rem' },
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("عذرًا، حدث خطأ أثناء تحليل الرسمة. يرجى المحاولة مرة أخرى.", {
        icon: "❌",
        duration: 5000,
        className: "text-lg font-medium",
        style: { fontSize: '1.25rem', lineHeight: '1.75rem' },
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-4 rounded-3xl bg-white/30 backdrop-blur-sm shadow-lg">
      <h2 className="text-2xl font-bold mb-3 text-purple-900">لوحة الرسم</h2>
      <ColorPicker selectedColor={color} onSelectColor={setColor} />
      <div className="w-full flex justify-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl">
          <span className="text-sm font-medium">حجم الفرشاة:</span>
          <div className="flex gap-2">
            {[8, 12, 20, 30].map((size) => (
              <button
                key={size}
                className={`w-${size / 4} h-${size / 4} rounded-full bg-black transition-all ${brushSize === size ? 'ring-2 ring-kidsYellow scale-110' : ''}`}
                onClick={() => setBrushSize(size)}
                title={`حجم الفرشاة ${size}px`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="relative border-4 border-kidsLavender rounded-xl shadow-lg overflow-hidden w-full h-[40vh]">
        <canvas
          ref={canvasRef}
          className="bg-white touch-none w-full h-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        <Button onClick={clearCanvas} className="bg-kidsLavender hover:bg-kidsLavender/80 text-black">
          مسح اللوحة
        </Button>
        <Button
          onClick={toggleSparkleMode}
          className={`${sparkleMode ? 'bg-kidsYellow' : 'bg-kidsBlue'} hover:bg-kidsYellow/80 text-black flex items-center gap-2`}
        >
          <Wand2 size={18} />
          {sparkleMode ? 'إيقاف السحر' : 'العصا السحرية'}
        </Button>
        <Button
          onClick={downloadDrawing}
          className="bg-kidsGreen hover:bg-kidsGreen/80 text-black flex items-center gap-2"
        >
          <Download size={18} />
          حفظ الرسم
        </Button>
        <Button
          onClick={handleAnalyzeDrawing}
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
              أخبرني عن رسمي
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DrawingCanvas;