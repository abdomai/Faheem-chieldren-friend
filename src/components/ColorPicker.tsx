
import React from 'react';

type ColorOption = {
  color: string;
  name: string;
};

type ColorPickerProps = {
  selectedColor: string;
  onSelectColor: (color: string) => void;
};

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelectColor }) => {
  const colors: ColorOption[] = [
    { color: "#FF6B6B", name: "Strawberry Red" },
    { color: "#F8C8DC", name: "Unicorn Pink" },
    { color: "#FDFD96", name: "Lemon Yellow" },
    { color: "#C1E1C1", name: "Dragon Green" },
    { color: "#A7C7E7", name: "Sky Blue" },
    { color: "#C3B1E1", name: "Magic Purple" },
    { color: "#FA8072", name: "Coral Orange" },
    { color: "#77DD77", name: "Frog Green" },
    { color: "#FFB347", name: "Tiger Orange" },
    { color: "#B39EB5", name: "Fairy Lavender" },
    { color: "#836953", name: "Bear Brown" },
    { color: "#000000", name: "Night Black" }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 p-2 bg-white/80 rounded-xl shadow-md mb-3">
      {colors.map((colorOption, index) => (
        <button 
          key={index}
          className={`w-10 h-10 rounded-full transition-all duration-200 focus:outline-none ${selectedColor === colorOption.color ? 'ring-4 ring-kidsYellow scale-110' : 'hover:scale-105'}`}
          style={{ backgroundColor: colorOption.color }}
          onClick={() => onSelectColor(colorOption.color)}
          title={colorOption.name}
          aria-label={`Select ${colorOption.name}`}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
