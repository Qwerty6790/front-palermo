'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ProductI } from '../../types/interfaces'; // Импортируем интерфейс Product

const Liked: React.FC = () => {
  const router = useRouter();
  const [likedProducts, setLikedProducts] = useState<ProductI[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      const liked = JSON.parse(localStorage.getItem('liked') || '{"products": []}');

      if (liked.products.length > 0) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/products`, {
            products: liked.products,
          }, {
            headers: { 'Content-Type': 'application/json' },
          });

          setLikedProducts(response.data.products);
        } catch (error) {
          setError('Произошла ошибка при загрузке продуктов из Избранного.');
          console.error(error);
        }
      } else {
        setError('Избранное пусто.');
      }
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
      className="py-20 dark:bg-black dark:text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto mt-20">
        <div className="p-4 mx-auto md:px-10 lg:px-32 xl:max-w-3xl">
          <h1 className="text-2xl font-bold text-center mb-6">Избранное</h1>
          <div className="flex flex-col mt-4">
            {error ? (
              <div className="text-center p-4">{error}</div>
            ) : (
              likedProducts.length > 0 ? (
                likedProducts.map((product) => (
                  <div key={product._id} className="flex justify-between items-center border-b p-4 transition-all duration-300">
                    <img src={product.imageAddress} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
                    <div className="flex-grow mx-4">
                      <h2 className="text-lg font-semibold">{product.name}</h2>
                      <p className="text-gray-300">Цена: {product.price} ₽</p>
                      <p className="text-gray-300">Количество: {product.quantity}</p>
                      <p className="text-gray-300">Общая сумма: {product.price * product.quantity} ₽</p>
                    </div>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => handleRemoveProduct(product._id)}
                    >
                      Удалить
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center p-4">Корзина пуста.</div>
              )
            )}
            {likedProducts.length > 0 && (
              <>
                <div className="flex justify-between font-bold border-t-2 mt-4 p-4">
                  <span>Итого:</span>
                  <span>{totalAmount} ₽</span>
                </div>
                <div className="flex justify-end p-4">
                  <div className="space-x-4">
                    <button
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                      onClick={handleClearCart}
                    >
                      Очистить Избранное
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          
        </div>
      </div>
    </motion.section>
  );
};

export default Liked;
