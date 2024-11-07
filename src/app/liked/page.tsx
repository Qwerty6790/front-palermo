'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import { ProductI } from '../../types/interfaces';
import { ClipLoader } from 'react-spinners';

const Liked: React.FC = () => {
  const [likedProducts, setLikedProducts] = useState<ProductI[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      setLoading(true);
      const liked = JSON.parse(localStorage.getItem('liked') || '{"products": []}');

      if (liked.products.length > 0) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/products/list`,
            { products: liked.products },
            { headers: { 'Content-Type': 'application/json' } }
          );
          setLikedProducts(response.data.products);
        } catch (error) {
          setError('Произошла ошибка при загрузке продуктов из Избранного.');
          console.error(error);
        }
      } else {
        setError('Избранное пусто.');
      }
      setLoading(false);
    };

    fetchLikedProducts();
  }, []);

  const handleRemoveProduct = (id: string) => {
    setLikedProducts((prevProducts) => {
      const updatedProducts = prevProducts
        .map((product) => {
          if (product._id === id) {
            const updatedQuantity = product.quantity - 1;
            return updatedQuantity <= 0 ? null : { ...product, quantity: updatedQuantity };
          }
          return product;
        })
        .filter((product) => product !== null) as ProductI[];

      localStorage.setItem('liked', JSON.stringify({ products: updatedProducts }));
      toast.success('Товар удален из избранного');
      return updatedProducts;
    });
  };

  const handleClearCart = () => {
    setLikedProducts([]);
    localStorage.setItem('liked', JSON.stringify({ products: [] }));
    setError('Избранное пусто.');
    toast.success('Избранное очищена');
  };

  const totalAmount = likedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);

  return (
    <motion.section
      className="py-10 sm:py-16  lg:py-20 bg-gray-50 dark:bg-black dark:text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mt-20 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Large Heart SVG */}
        <div className="flex justify-center mb-6">
          <svg
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 text-red-500"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-black">
          Ваши Избранные Товары
        </h1>

        <div className="space-y-8">
          {loading ? (
            <div className="flex justify-center">
              <ClipLoader color="#FFFFF" loading={loading} size={50} />
            </div>
          ) : error ? (
            <div className="text-center p-4 text-lg font-semibold">{error}</div>
          ) : (
            likedProducts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {likedProducts.map((product) => (
                  <div key={product._id} className="flex flex-col items-center border-b p-4 md:p-6 rounded-lg bg-white dark:bg-black shadow-lg hover:shadow-xl transition-all duration-300">
                    <img src={product.imageAddress} alt={product.name} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shadow-md" />
                    <div className="mt-4 flex-grow text-center">
                      <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">{product.name}</h2>
                      <p className="text-gray-600 dark:text-gray-300">Цена: {product.price} ₽</p>
                    </div>
                    <button
                      className="mt-4 px-4 py-2 bg-red-950 text-white rounded-md hover:bg-red-600 transition duration-200"
                      onClick={() => handleRemoveProduct(product._id)}
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 text-lg">Ваши Избранные товары пусты.</div>
            )
          )}
          {likedProducts.length > 0 && (
            <div className="flex justify-end p-4">
              <button
                className="px-6 py-3 bg-red-950 hover:bg-red-600 text-white rounded-md shadow-md"
                onClick={handleClearCart}
              >
                Очистить Избранное
              </button>
            </div>
          )}
        </div>
      </div>
      <Toaster position="bottom-center" />
    </motion.section>
  );
};

export default Liked;
