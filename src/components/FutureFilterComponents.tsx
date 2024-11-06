import { ChevronDown } from 'lucide-react';
import React from 'react';

const FilterSed: React.FC = () => {
  return (
    <div className='flex flex-col text-xl gap-5'>
      <div className="flex flex-col items-center">
        {[
          "Диаметр",
          "Высота",
          "Ширина",
          "Глубина",
          "Площадь",
          "Стиль",
        ].map((label) => (
          <button
            key={label}
            className="w-full max-w-md text-left text-white py-4 font-bold rounded-md flex justify-between items-center transition-transform transform hover:scale-105"
          >
            <span className='transition-transform transform'>
              <ChevronDown className="hidden md:block" color="white" size={22} />
            </span>
            <span className='flex-grow text-left ml-2'>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSed;
