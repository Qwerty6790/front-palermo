'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Toaster } from 'sonner';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios'; // Importing axios
import { ProductI } from '../../types/interfaces';
import { CatalogOfProducts } from '../../components/CatalogOfProducts';
import Pagination from '../../components/PaginationComponents';
import { ClipLoader } from 'react-spinners';
import FilterSed from '@/components/FutureFilterComponents';
import FilterOptions from '@/components/FutureFilter2';

type Category = {
  label: string;
  href?: string;
  searchName: string;
};

type Brand = {
  name: string;
  categories: Category[];
  collection?: string;
};

// Brands and categories data
const brands: Brand[] = [
  {
    name: 'FavouriteLight',
    categories: [
      { label: 'Потолочная Люстра', searchName: 'Потолочная Люстра' },
      { label: 'Люстра подвесная', searchName: 'Люстра подвесная' },
      { label: 'Потолочный Светильник', searchName: 'Потолочный Светильник' },
      { label: 'Врезной Светильник', searchName: 'Врезной Светильник' },
      { label: 'Настенный Светильник', searchName: 'Настенный Светильник' },
      { label: 'Напольный Светильник', searchName: 'Напольный Светильник' },
      { label: 'Настольный Светильник', searchName: 'Настольный Светильник' },
      { label: 'Подвес', searchName: 'Подвес' }, 
      { label: 'Уличный светильник', searchName: 'Уличный светильник' },
    ],
  },
  {
    name: 'KinkLight',
    categories: [
      { label: 'Люстра', href: '/Catalog', searchName: 'Люстра' },
      { label: 'Настольная лампа', href: '/Catalog', searchName: 'Настольная лампа' },
      { label: 'Кресло', href: '/Catalog', searchName: 'Кресло' },
      { label: 'Торшер', href: '/web-1nashtange', searchName: 'Торшер' },
      { label: 'Настенный Светильник', href: '/web-1podvesnoy', searchName: 'Настенный Светильник' },
      { label: 'Светильник уличный', href: '/office-lamps', searchName: 'Светильник уличный' },
      { label: 'Подвес', href: '/decorative-lamps', searchName: 'Подвес' },
      { label: 'Бра', href: '/decorative-lamps', searchName: 'Бра' },
      { label: 'Светильник', href: '/decorative-lamps', searchName: 'Светильник' },
      { label: 'Трековый светильник', href: '/decorative-lamps', searchName: 'трековый светильник' },
      { label: 'Настенный светильник', href: '/decorative-lamps', searchName: 'настенный светильник' },
      { label: 'Шнур с перекл', href: '/decorative-lamps', searchName: 'Шнур с перекл' },
    ],
  },
  {
    name: 'EksMarket',
    categories: [
      { label: 'Люстра', searchName: 'Люстра' },
      { label: 'Лампа', searchName: 'Лампа' },
      { label: 'Подвес', searchName: 'Подвес' }, 
      { label: 'Светильник', searchName: 'Светильник' },
      { label: 'Пульт', searchName: 'Пульт' },
      { label: 'Блок питания', searchName: 'Блок питания' },
    ],
  },
  {
    name: 'LightStar',
    categories: [
      { label: 'Люстра', searchName: 'Люстра' },
      { label: 'Люстра подвесная', searchName: 'Люстра подвесная' },
      { label: 'Подвес', searchName: 'Подвес' }, 
      { label: 'Бра', searchName: 'Бра' },
      { label: 'Светильник', searchName: 'Светильник' },
      { label: 'Настольная лампа', href: '/Catalog', searchName: 'Настольная лампа' },
      { label: 'Торшер', href: '/web-1nashtange', searchName: 'Торшер' },
      { label: 'Светильник уличный', href: '/office-lamps', searchName: 'Светильник уличный' },
    ],
  },
  {
    name: 'ElektroStandart',
    categories: [
      { label: 'Потолочный', searchName: 'Потолочный' },
      { label: 'Подвесной', searchName: 'Подвесной' },
      { label: 'Подвес', searchName: 'Подвес' }, 
      { label: 'Уличный светильник', searchName: 'Уличный светильник' },
      { label: 'Лампа', searchName: 'Лампа' },
      { label: 'Настольный', searchName: 'Настольный' },
      { label: 'Лента', searchName: 'Лента' },
      { label: 'Неон', searchName: 'Неон' },
      { label: 'Настенный', searchName: 'Настенный' },
      { label: 'Датчик', searchName: 'Датчик' },
      { label: 'Ландшафт', searchName: 'Ландшафт' },
    ],
  },
  {
    name: 'Denkirs',
    categories: [
      { label: 'Светильник', searchName: 'Светильник' },
      { label: 'Подвесной светильник', searchName: 'Подвесной светильник' },
      { label: 'Бра', searchName: 'Бра' },
      { label: 'Уличный светильник', searchName: 'Уличный светильник' },
      { label: 'Встраиваемый', searchName: 'Встраиваемый' },
    ],
  },
  {
    name: 'Werkel',
    categories: [
      { label: 'Выключатель', searchName: 'Выключатель' },
      { label: 'Розетка', searchName: 'Розетка' },
      { label: 'Датчик', searchName: 'Датчик' }, 
      { label: 'Провод', searchName: 'Провод' },
    ],
  },
];


const Catalog: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<Brand>(brands[0]);
  const [products, setProducts] = useState<ProductI[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category>(selectedBrand.categories[0]);
  const [minPrice, setMinPrice] = useState<number>(10);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<boolean>(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch products
  const fetchProducts = async (page: number, name: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${selectedBrand.name}`, {
        params: {
          page,
          limit: 12,
          name,
          minPrice,
          maxPrice,
        },
      });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setTotalProducts(res.data.totalProducts);
    } catch (error) {
      console.error('Ошибка при загрузке продуктов:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection
  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowCategoryDropdown(false);
  };

  // Handle brand selection
  const handleBrandChange = (brand: Brand) => {
    setSelectedBrand(brand);
    setSelectedCategory(brand.categories[0]);
    setCurrentPage(1);
    setShowBrandDropdown(false);
  };

  // Handle price range change
  const handlePriceChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
    setter(value);
  };

  // Fetch products when dependencies change
  useEffect(() => {
    fetchProducts(currentPage, selectedCategory.searchName);
  }, [currentPage, selectedCategory, minPrice, maxPrice, selectedBrand]);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target as Node)) {
        setShowBrandDropdown(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <>
      <div className="flex justify-center  items-start">
        <Toaster position="top-center" richColors />
        <div className="flex flex-col md:flex-row -mx-20 w-full max-w-6xl mt-44">
          {/* Filters Section */}
        <div>
          <p className='-ml-56 xl:hidden lg:hidden max-xl:hidden max-1xl:hidden   max-lg:hidden max-md:hidden text-5xl text-white '>Скоро</p>
          <FilterOptions />
        </div>
          <div className="w-full text-2xl   md:w-1/4 lg:w-4/4 h-auto bg-black p-2 flex flex-col  justify-start items-center space-y-2 md:mb-4">
    <div className="w-full ">
      {/* Brand Dropdown */}
      <div className="relative  w-full" ref={brandDropdownRef}>
        <button
          className="w-full text-left text-white py-1   font-bold rounded-md bg-black flex justify-between items-center"
          onClick={() => {
            setShowBrandDropdown(!showBrandDropdown);
            setShowCategoryDropdown(false);
          }}
        >
          {selectedBrand.name}
          <ChevronDown className={`transition-transform transform ${showBrandDropdown ? 'rotate-180' : 'rotate-0'}`} color="white" size={20} />
        </button>
        <AnimatePresence>
          {showBrandDropdown && (
            <motion.div
              className="absolute left-0 mt-1 w-full bg-black rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {brands.map((brand) => (
                <div
                  key={brand.name}
                  className="cursor-pointer hover:bg-gray-700 p-2 text-white"
                  onClick={() => handleBrandChange(brand)}
                >
                  {brand.name}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Dropdown */}
      <div className="relative w-full" ref={categoryDropdownRef}>
        <button
          className="w-full text-left text-white py-1  font-bold rounded-md bg-black flex justify-between items-center"
          onClick={() => {
            setShowCategoryDropdown(!showCategoryDropdown);
            setShowBrandDropdown(false);
          }}
        >
          {selectedCategory.label}
          <ChevronDown className={`transition-transform transform ${showCategoryDropdown ? 'rotate-180' : 'rotate-0'}`} color="white" size={20} />
        </button>
        <AnimatePresence>
          {showCategoryDropdown && (
            <motion.div
              className="absolute left-0 mt-1 w-full bg-black rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {selectedBrand.categories.map((category) => (
                <div
                  key={category.searchName}
                  className="cursor-pointer hover:bg-gray-700 p-2 text-white"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category.label}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range Filter */}
      <div className="w-full  mt-2">
        <h2 className="text-white   font-bold mb-1 text-sm">Цена</h2>
        <div className="flex lg:flex-col lg:w-80 justify-between mb-1">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => handlePriceChange(setMinPrice, Number(e.target.value))}
            className="bg-black lg:w-32 д border text-white py-1 px-2 rounded w-1/3 text-sm"
            placeholder="Мин"
          />
          <span className="text-white text-sm">-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => handlePriceChange(setMaxPrice, Number(e.target.value))}
            className="bg-black border text-white py-1 px-2 rounded w-1/3 text-sm"
            placeholder="Макс"
          />
        </div>

        {/* Price Range Slider */}
        <div className="flex  lg:w-36 lg:flex-col  items-center">
          <input
            type="range"
            min="0"
            max="1000" // Adjust this max value based on your pricing range
            value={minPrice}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value <= maxPrice) setMinPrice(value); // Ensure min is not greater than max
            }}
            className="w-full  mx-1"
          />
          <input
            type="range"
            min="0"
            max="1000" // Adjust this max value based on your pricing range
            value={maxPrice}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= minPrice) setMaxPrice(value); // Ensure max is not less than min
            }}
            className="w-full  mx-1"
          />
        </div>

        <div className="flex  lg:flex-col justify-between">
          <span className="text-white text-sm">Мин: {minPrice}</span>
          <span className="text-white text-sm">Макс: {maxPrice}</span>
        </div>   
      </div> 
      <FilterSed />  
    </div>
  </div>

          {/* Products Section */}
          <div className="w-full max-md:ml-0 max-md:scale-100 scale-90 max-xl:scale-[65%]   max-xl:-ml-32    bg-black p-4 rounded-lg">
  {loading ? (
    <div className="flex justify-center items-center h-full"> {/* Center the loader */}
      <ClipLoader color="#ffffff" loading={loading} size={50} /> {/* Adjust the size as needed */}
    </div>
  ) : (
    <>
      <h1 className="text-3xl font-bold text-white mb-2">{` ${selectedCategory.label}`}</h1>
      <p className="text-lg text-white mb-4">{`Количество товаров ${totalProducts}`} шт.</p> {/* Display the number of products */}
      <CatalogOfProducts products={products} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </>
  )}
</div>
        </div>
      </div>
      
    </>
  );
};

export default Catalog;
