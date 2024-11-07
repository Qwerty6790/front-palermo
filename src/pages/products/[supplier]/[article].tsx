import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css';
import Header from '@/components/Header';
import { Toaster, toast } from 'sonner';
import { Heart, Facebook, Twitter, Send } from 'lucide-react';
import ClipLoader from 'react-spinners/ClipLoader'; // Import the spinner

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
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!supplier || !article) return;

      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${supplier}/${article}`);
        setProduct(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Ошибка при загрузке товара');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [supplier, article]);

  useEffect(() => {
    // Проверяем, есть ли этот товар в избранном, и устанавливаем статус "лайкнут"
    const liked = JSON.parse(localStorage.getItem('liked') || '{"products": []}');
    const isProductLiked = liked.products.some((item: any) => item.article === product?.article);
    setIsLiked(isProductLiked);
  }, [product]);

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

    const cart = JSON.parse(localStorage.getItem('cart') || '{"products": []}');
    const existingProductIndex = cart.products.findIndex((item: any) => item.article === product.article);

    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({ article: product.article, source: product.source, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Товар добавлен в корзину');
  };

  const addToLiked = () => {
    if (!product) {
      toast.error('Товар не найден');
      return;
    }

    const liked = JSON.parse(localStorage.getItem('liked') || '{"products": []}');
    const existingProductIndex = liked.products.findIndex((item: any) => item.article === product.article);

    if (existingProductIndex > -1) {
      // Если товар уже есть в избранном, удаляем его
      liked.products.splice(existingProductIndex, 1);
      setIsLiked(false);  // Обновляем статус лайка
      toast.success('Товар удален из избранного');
    } else {
      // Добавляем товар в избранное
      liked.products.push({ article: product.article, source: product.source, quantity: 1 });
      setIsLiked(true);  // Обновляем статус лайка
      toast.success('Товар добавлен в избранное');
    }

    localStorage.setItem('liked', JSON.stringify(liked));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        {/* Show spinner when loading */}
        <ClipLoader size={50} color="#ffffff" loading={loading} />
        <p className="mt-4">Загрузка...</p>
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
                onClick={addToCart}
                className="bg-blue-600 text-white py-3 px-6 rounded-md transition duration-500 hover:bg-blue-700 w-full"
              >
                В Корзину
              </button>
              <div className="flex items-center justify-between mt-4 space-x-4">
                <button onClick={addToLiked} className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Heart fill={isLiked ? 'red' : 'none'} className="w-6 h-6" />
                  <span>{isLiked ? 'Удалить из избранного' : 'В избранное'}</span>
                </button>
                <div className="flex space-x-4">
                  <button>
                    <Facebook color="white" size={24} />
                  </button>
                  <button>
                    <Twitter color="white" size={24} />
                  </button>
                  <button>
                    <Send color="white" size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
