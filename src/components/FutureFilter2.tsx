import { ChevronDown, Filter, Tag, Grid } from 'lucide-react';
import React from 'react';

const FilterOptions: React.FC = () => {
  return (
    <div className="flex flex-col -ml-56 max-md:hidden max-xl:hidden  items-center justify-start py-6 px-4 rounded-lg shadow-md bg-gradient-to-l from-black sticky top-0 z-10">
      {[
        { label: "По релевантности", icon: <Filter color="white" size={18} /> },
        { label: "По бренду", icon: <Tag color="white" size={18} /> },
        { label: "Новые", icon: <Tag color="white" size={18} /> },
        { label: "По коллекции", icon: <Grid color="white" size={18} /> },
        { label: "Сравнение", icon: <Grid color="white" size={18} /> },
        { label: "Комната", icon: <Tag color="white" size={18} /> },
        { label: "Свет", icon: <Tag color="white" size={18} /> },
        { label: "Тип", icon: <Grid color="white" size={18} /> },
        { label: "3D", icon: <Grid color="white" size={18} /> },
      ].map((filter, index) => (
        <React.Fragment key={filter.label}>
          {index > 0 && (
            <span className="w-px h-8 bg-neutral-700 mx-4" />
          )}
          <button
            className="flex items-center justify-between px-2 py-2 font-medium text-gray-200 rounded-lg bg-neutral-900 hover:bg-neutral-700 transition-colors duration-200 transform hover:scale-105"
          >
            <span className="mr-2">{filter.icon}</span>
            {filter.label}
            <ChevronDown className="ml-2" color="white" size={18} />
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default FilterOptions;
