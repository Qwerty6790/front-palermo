import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css';
import Header from '@/components/Header';
import { Toaster, toast } from 'sonner';

interface ProductI {
  _id: string; 
  article: string;
  name: string;
  price: number;
  stock: string;
  imageAddress: string;
  source: string;
}

const ProductDetail: React.FC = () => {
  const router = useRouter();
  const { supplier, article } = router.query;

  const [product, setProduct] = useState<ProductI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!supplier || !article) return; // Проверяем наличие параметров

      setLoading(true); // Устанавливаем состояние загрузки
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${supplier}/${article}`);
        setProduct(response.data); // Предполагается, что данные о продукте находятся в response.data
      } catch (error) {
        console.error(error);
        toast.error('Ошибка при загрузке товара');
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    fetchProduct();
  }, [supplier, article]); // Зависимости для useEffect

  const extractStock = (stock: string): number => {
    const match = stock.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const addToCart = () => {
    if (!product) {
      toast.error('Товар не найден');
      return;
    }

    const stockCount = extractStock(product.stock);

    if (stockCount <= 0) {
      toast.error('Товар закончился');
      return;
    }

    // Получаем корзину из локального хранилища
    const cart = JSON.parse(localStorage.getItem('cart') || '{"products": []}');
    const existingProductIndex = cart.products.findIndex((item: any) => item.article === product.article);

    if (existingProductIndex > -1) {
      // Если товар уже в корзине, увеличиваем количество
      cart.products[existingProductIndex].quantity += 1;
    } else {
      // Если товара нет в корзине, добавляем его
      cart.products.push({ 
        article: product.article, 
        source: product.source, 
        quantity: 1
      });
    }

    // Сохраняем обновлённую корзину в локальном хранилище
    localStorage.setItem('cart', JSON.stringify(cart));

    toast.success('Товар добавлен в корзину');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <p>Товар не найден</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Toaster position="top-center" richColors />
      <Header />
      <div className="flex justify-center mt-40 items-center flex-1 p-6">
        <div className="bg-black rounded-lg shadow-lg flex flex-col md:flex-row max-w-4xl w-full">
          <img
            className="w-full md:w-2/3 h-auto object-cover rounded-lg"
            src={product.imageAddress}
            alt={product.name}
          />
          <div className="w-full md:w-1/2 flex flex-col justify-between p-6">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-4">
                {product.name}
              </h1>
              <p className="text-xl text-gray-300 font-semibold mt-2">{product.price} ₽</p>
              <p className="text-sm text-white mt-2">Артикул: {product.article}</p>
              <p className="text-sm text-white mt-2">Остаток: {product.stock} шт.</p>
            </div>
            <div className="mt-4">
              <button
                onClick={addToCart} // Используем функцию добавления в корзину
                className="bg-blue-600 text-white py-3 px-6 rounded-md transition duration-500 hover:bg-blue-700 w-full"
              >
                В Корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
