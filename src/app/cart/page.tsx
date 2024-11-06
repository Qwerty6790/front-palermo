'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ProductI } from '../../types/interfaces'; // Импортируем интерфейс Product

const Cart: React.FC = () => {
  const router = useRouter();
  const [cartProducts, setCartProducts] = useState<ProductI[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    const fetchCartProducts = async () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '{"products": []}');
      const storedCartCount = localStorage.getItem('cartCount');

      if (storedCartCount) {
        setCartCount(Number(storedCartCount));
      }

      if (cart.products.length > 0) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/products`, {
            products: cart.products,
          }, {
            headers: { 'Content-Type': 'application/json' },
          });

          setCartProducts(response.data.products);
        } catch (error) {
          setError('Произошла ошибка при загрузке продуктов из корзины.');
          console.error(error);
        }
      } else {
        setError('Корзина пуста.');
      }
    };

    fetchCartProducts();
  }, []);

  const handleRemoveProduct = (id: string) => {
    setCartProducts((prevProducts) => {
      const updatedProducts = prevProducts
        .map((product) => {
          if (product._id === id) {
            const updatedQuantity = product.quantity - 1;
            return updatedQuantity <= 0 ? null : { ...product, quantity: updatedQuantity };
          }
          return product;
        })
        .filter((product) => product !== null) as ProductI[];

      localStorage.setItem('cart', JSON.stringify({ products: updatedProducts }));
      setCartCount(updatedProducts.length);
      localStorage.setItem('cartCount', updatedProducts.length.toString());

      toast.success('Товар удален из корзины');
      return updatedProducts;
    });
  };

  const handleClearCart = () => {
    setCartProducts([]);
    localStorage.setItem('cart', JSON.stringify({ products: [] }));
    setCartCount(0);
    localStorage.setItem('cartCount', '0');
    setError('Корзина пуста.');
    toast.success('Корзина очищена');
  };

  const handleOrder = () => {
    if (!isAuthenticated) {
      router.push('/profile');
      return;
    }
    setIsModalOpen(true);
  };

  const confirmOrder = async () => {
    const token = localStorage.getItem('token');
    const products = cartProducts.map((product) => ({
      name: product.name,
      article: product.article, 
      source: product.source,
      quantity: product.quantity,
      price: product.price,
    }));

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/add-order`, {
        products,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Заказ успешно создан!');
      handleClearCart();
      setIsModalOpen(false);
      router.push('/orders');
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      
      if (error instanceof AxiosError && error.response?.status === 403) {
        toast.error('Пожалуйста, войдите в аккаунт заново.');
        localStorage.removeItem('token');
      } else {
        toast.error('Ошибка при создании заказа.');
      }
    }
  };

  const totalAmount = cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);

  return (
    <motion.section
      className="py-20 dark:bg-black dark:text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto mt-20">
        <div className="p-4 mx-auto md:px-10 lg:px-32 xl:max-w-3xl">
          <h1 className="text-2xl font-bold text-center mb-6">Корзина</h1>
          <div className="flex flex-col mt-4">
            {error ? (
              <div className="text-center p-4">{error}</div>
            ) : (
              cartProducts.length > 0 ? (
                cartProducts.map((product) => (
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
            {cartProducts.length > 0 && (
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
                      Очистить Корзину
                    </button>
                    <button
                      onClick={handleOrder}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                    >
                      Заказать
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
              <div className="bg-white p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <h2 className="text-2xl font-bold text-center text-gray-800">Подтверждение Заказа</h2>
                <p className="mt-2 text-gray-600 text-center">Вы уверены, что хотите оформить заказ?</p>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition duration-200"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Отмена
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition duration-200"
                    onClick={confirmOrder}
                  >
                    Подтвердить
                  </button>
                </div>
              </div>
            </div>
          )}
          <Toaster />
        </div>
      </div>
    </motion.section>
  );
};

export default Cart;
