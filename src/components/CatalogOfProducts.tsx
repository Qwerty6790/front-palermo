import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ProductI } from '../types/interfaces'; // Import the Order interface

interface CatalogOfProductsProps {
  products: ProductI[];
}

const getStockCount = (stock: string): number => {
  const match = stock.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export const CatalogOfProducts: React.FC<CatalogOfProductsProps> = ({ products }) => {

  const addToCart = (article: string, source: string, name: string) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '{"products": []}');
    const existingProductIndex = cart.products.findIndex((item: any) => item.article === article);

    if (existingProductIndex > -1) {
        cart.products[existingProductIndex].quantity += 1;
    } else {
        cart.products.push({ article, source, quantity: 1 }); // Добавляем имя
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    toast.success('Товар добавлен в корзину');
};

  return (
    <div className="grid grid-cols-1 scale-90 -mt-10  lg:w-[1300px] lg:-ml-44 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-5">
      {products.map((product) => {
        const stockCount = getStockCount(product.stock);
        const stockClass = stockCount > 0 ? 'text-green-500' : 'text-red-500';

        return (
          <div key={product._id} className="relative shadow-lg transition duration-500 cursor-pointer bg-white border border-zinc-700 rounded-lg overflow-hidden">
            <Link href={`/products/${product.source}/${product.article}`} passHref>
              <img
                className="w-full h-48 sm:h-56 md:h-64 object-cover"
                src={product.imageAddress}
                alt={product.name}
              />
            </Link>
            <div className="p-4 bg-white">
              <h2 className="text-black text-lg font-semibold truncate">{product.name}</h2>
              <p className="font-bold text-black text-xl mt-1">
                {product.price} ₽
              </p>
              <div className="flex justify-between items-center mt-4">
                <div className={`text-sm ${stockClass}`}>
                  <p>Остаток: {stockCount} шт.</p>
                </div>
                <button
                    className={`border transition duration-500 py-1 rounded-md w-24 ${stockCount === 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'hover:bg-black hover:text-white'}`}
                    onClick={() => {
                        if (stockCount > 0) {
                            addToCart(product.article, product.source, product.name); // Передаем имя продукта
                        }
                    }}
                    disabled={stockCount === 0}
                >
                    <p>В Корзину</p>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
