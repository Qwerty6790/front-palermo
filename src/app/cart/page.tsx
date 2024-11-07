'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ProductI } from '../../types/interfaces';
import { ClipLoader } from 'react-spinners';
import Link from 'next/link';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa'; // Importing icons

const Cart: React.FC = () => {
  const router = useRouter();
  const [cartProducts, setCartProducts] = useState<ProductI[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/products/list`, {
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
      setIsLoading(false);
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

  const handleIncreaseQuantity = (id: string) => {
    setCartProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) => {
        if (product._id === id) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });

      localStorage.setItem('cart', JSON.stringify({ products: updatedProducts }));
      setCartCount(updatedProducts.length);
      localStorage.setItem('cartCount', updatedProducts.length.toString());

      return updatedProducts;
    });
  };

  const handleDecreaseQuantity = (id: string) => {
    setCartProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) => {
        if (product._id === id && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });

      localStorage.setItem('cart', JSON.stringify({ products: updatedProducts }));
      setCartCount(updatedProducts.length);
      localStorage.setItem('cartCount', updatedProducts.length.toString());

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
    setIsModalOpen(true); // Open the modal when ordering
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
      setIsModalOpen(false); // Close the modal after successful order
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

  const cancelOrder = () => {
    setIsModalOpen(false); // Close the modal without placing the order
  };

  const totalAmount = cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
  const deliveryCost = 300;

  return (
    <motion.section
      className="py-20 dark:bg-black dark:text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto mt-20">
        <div className="text-center">
          {/* Large Cart SVG */}
          <svg className="w-20 h-20 mx-auto mb-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5H2m5 8l1.6 6M15 13l1.6 6M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          <h1 className="text-4xl font-bold mb-10 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-black">
            Корзина
          </h1>
        </div>
        <div className="p-4 md:px-10 lg:px-32 xl:max-w-3xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <ClipLoader color="#FFFFF" size={50} />
            </div>
          ) : error ? (
            <div className="text-center p-4">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse mt-4">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="p-4">Продукт</th>
                    <th className="p-4">Количество</th>
                    <th className="p-4">Цена</th>
                    <th className="p-4">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {cartProducts.map((product) => (
                    <tr key={product._id} className="border-b bg-black hover:bg-gray-700">
                      <td className="p-4">
                        <Link href={`/products/${product.source}/${product.article}`}>
                          <img
                            src={product.imageAddress}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <div>
                            <h2 className="text-lg font-semibold text-white">{product.name}</h2>
                          </div>
                        </Link>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDecreaseQuantity(product._id)}
                          className="px-2 py-1 border border-gray-500 rounded-md"
                        >
                          <FaMinus />
                        </button>
                        <span className="px-4">{product.quantity}</span>
                        <button
                          onClick={() => handleIncreaseQuantity(product._id)}
                          className="px-2 py-1 border border-gray-500 rounded-md"
                        >
                          <FaPlus />
                        </button>
                      </td>
                      <td className="p-4 text-center">{product.price * product.quantity} ₽</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleRemoveProduct(product._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Total & Checkout Section */}
        <div className="mt-8 text-center">
          <div className="flex justify-between mb-4 text-lg font-semibold">
            <span>Итого:</span>
            <span>{totalAmount + deliveryCost} ₽</span>
          </div>
          <button
            onClick={handleOrder}
            className="w-full bg-black text-white py-3 rounded-md text-lg hover:bg-gray-800"
          >
            Оформить заказ
          </button>
          <button
            onClick={handleClearCart}
            className="w-full bg-red-600 text-white py-3 mt-4 rounded-md text-lg hover:bg-red-500"
          >
            Очистить корзину
          </button>
        </div>

        {/* Modal for Order Confirmation */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full">
              <h2 className="text-xl font-semibold mb-4">Подтверждение заказа</h2>
              <p className="mb-6">Вы уверены, что хотите оформить заказ?</p>
              <div className="flex justify-between">
                <button
                  onClick={cancelOrder}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                >
                  Отмена
                </button>
                <button
                  onClick={confirmOrder}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                >
                  Подтвердить
                </button>
              </div>
            </div>
          </div>
        )}

        <Toaster position="top-center" />
      </div>
    </motion.section>
  );
};

export default Cart;
