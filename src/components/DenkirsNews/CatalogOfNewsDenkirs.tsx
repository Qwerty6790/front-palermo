import Link from 'next/link';
import React, { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export interface ProductI {
  _id: string; 
  article: string;
  name: string;
  price: number;
  stock: string;
  imageAddress: string;
  source: string;
}

export const CatalogOfProductsNewsDenkirs: React.FC<{ products: ProductI[] }> = ({ products }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative -ml-8 flex items-center">
      <button
        className="absolute left-6 z-10 p-2 text-5xl text-black rounded-full hover:bg-zinc-300 -translate-y-1/2"
        onClick={scrollLeft}
        aria-label="Scroll left"
        style={{ top: '50%' }}
      >
        <FiChevronLeft />
      </button>

      <div
        className="overflow-hidden cursor-default select-none" // Hide scrollbar
        ref={scrollRef}
        style={{ userSelect: 'none', width: '100%' }} // Ensure width is set
      >
        <div className="flex space-x-6 md:space-x-8 lg:space-x-10 p-4 transition-transform duration-300">
          {products.map((product) => {
            const stockCount = parseInt(product.stock);
            let stockClass = '';

            if (stockCount > 0) {
              stockClass = 'text-green-500'; // Green for stock 1 to 10
            } else {
              stockClass = 'text-red-500'; // Red for no stock
            }

            return (
              <Link key={product._id} href={`/products/${product.source}/${product.article}`} passHref>
                <div className="relative shadow-lg shadow-zinc-900 transition duration-300 cursor-pointer hover:shadow-zinc-600 bg-white border border-zinc-700 rounded-lg overflow-hidden w-60 sm:w-72 md:w-80">
                  <img
                    className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-200"
                    src={product.imageAddress}
                    alt={product.name}
                    style={{ pointerEvents: 'none' }}
                  />
                  <div className="p-4 bg-black">
                    <h2 className="text-white text-lg font-semibold truncate">{product.name}</h2>
                    <img className='absolute max-md:-left-0 max-md:top-56 -bottom-1 left-28 scale-[28%]' src='./images/Denkirs.png' alt='' />
                    <p className="font-bold text-white text-xl text-gradient-to-b from-zinc-300 to-white mt-1">
                      {product.price} ₽
                    </p>
                    <div className={`text-sm mt-2 ${stockClass}`}>
                      <p>Остаток: {product.stock} шт.</p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <button className="border max-md:ml-[120px] border-white transition duration-500 hover:bg-zinc-700 text-white py-1 rounded-md w-24 lg:ml-28 lg:mb-5">
                      В Корзину
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <button
        className="absolute  right-0 z-10 p-2 text-5xl text-black rounded-full hover:bg-zinc-300 transition-all duration-300 transform -translate-y-1/2"
        onClick={scrollRight}
        aria-label="Scroll right"
        style={{ top: '50%' }}
      >
        <FiChevronRight />
      </button>
    </div>
  );
};
