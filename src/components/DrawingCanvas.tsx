
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ColorPicker from './ColorPicker';
import { Wand2, Download, CheckCircle } from 'lucide-react';

const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF6B6B'); // Start with red
  const [brushSize, setBrushSize] = useState(12);
  const [canvasWidth, setCanvasWidth] = useState(600);
  const [canvasHeight, setCanvasHeight] = useState(400);
  const [sparkleMode, setSparkleMode] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Make canvas responsive
    const updateCanvasSize = () => {
      const containerWidth = Math.min(
        window.innerWidth > 768 ? 600 : window.innerWidth - 40,
        600
      );
      setCanvasWidth(containerWidth);
      setCanvasHeight(400);
      
      canvas.width = containerWidth;
      canvas.height = 400;
      
      // Reset the canvas context with new dimensions
      const context = canvas.getContext('2d');
      if (context) {
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = brushSize;
        context.strokeStyle = color;
        setCtx(context);
        
        // Fill with white background
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Update brush size and color when they change
  useEffect(() => {
    if (ctx) {
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = color;
    }
  }, [color, brushSize, ctx]);

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

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
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
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    toast("Canvas cleared! Start a new drawing!", {
      icon: "🎨"
    });
  };

  const toggleSparkleMode = () => {
    setSparkleMode(!sparkleMode);
    if (!sparkleMode) {
      toast("Magic wand activated! ✨ Draw sparkles!", {
        icon: "✨"
      });
    } else {
      toast("Back to regular drawing mode", {
        icon: "🖌️"
      });
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
    
    toast("Your drawing has been saved! 🎉", {
      icon: "💾"
    });
  };

  const analyzeDrawing = () => {
    toast("Wow, I see a beautiful drawing! It looks fantastic!", {
      icon: "🤖"
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto bg-white/30 p-4 rounded-3xl backdrop-blur-sm shadow-lg">
      <h2 className="text-2xl font-bold mb-3 text-purple-900">Drawing Canvas</h2>
      
      {/* Color picker */}
      <ColorPicker selectedColor={color} onSelectColor={setColor} />
      
      {/* Brush size selector */}
      <div className="w-full flex justify-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl">
          <span className="text-sm font-medium">Brush Size:</span>
          <div className="flex gap-2">
            {[8, 12, 20, 30].map((size) => (
              <button
                key={size}
                className={`w-${size / 4} h-${size / 4} rounded-full bg-black transition-all ${brushSize === size ? 'ring-2 ring-kidsYellow scale-110' : ''}`}
                onClick={() => setBrushSize(size)}
                title={`Brush size ${size}px`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Canvas */}
      <div className="relative border-4 border-kidsLavender rounded-xl shadow-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="bg-white touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        <Button 
          onClick={clearCanvas}
          className="bg-kidsLavender hover:bg-kidsLavender/80 text-black"
        >
          Clear Canvas
        </Button>
        
        <Button 
          onClick={toggleSparkleMode}
          className={`${sparkleMode ? 'bg-kidsYellow' : 'bg-kidsBlue'} hover:bg-kidsYellow/80 text-black flex items-center gap-2`}
        >
          <Wand2 size={18} />
          {sparkleMode ? 'Disable Magic' : 'Magic Wand'}
        </Button>
        
        <Button 
          onClick={downloadDrawing}
          className="bg-kidsGreen hover:bg-kidsGreen/80 text-black flex items-center gap-2"
        >
          <Download size={18} />
          Save Drawing
        </Button>
        
        <Button 
          onClick={analyzeDrawing}
          className="bg-kidsPink hover:bg-kidsPink/80 text-black flex items-center gap-2"
        >
          <CheckCircle size={18} />
          Tell Me About My Art
        </Button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
