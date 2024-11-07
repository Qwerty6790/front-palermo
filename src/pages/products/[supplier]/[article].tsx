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

  const shareOnTelegram = () => {
    if (product) {
      const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`;
      window.open(url, '_blank');
    }
  };

  const shareOnWhatsApp = () => {
    if (product) {
      const url = `https://wa.me/?text=${encodeURIComponent(product.name)}%20${encodeURIComponent(window.location.href)}`;
      window.open(url, '_blank');
    }
  };

  const shareOnFacebook = () => {
    if (product) {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
      window.open(url, '_blank');
    }
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
                  <button onClick={shareOnFacebook}>
                    <Facebook color="white" size={24} />
                  </button>
                  <button onClick={shareOnTelegram}>
                    <Send color="white" size={24} />
                  </button>
                  <button onClick={shareOnWhatsApp}>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-whatsapp">
    <path d="M4.68 3.84A9 9 0 0 1 12 1a9 9 0 0 1 7.32 12.84c-.34 1.26-.9 2.38-1.63 3.34l3.06 4.52-4.51-1.34a8.91 8.91 0 0 1-3.25 1.6A9 9 0 1 1 4.68 3.84zm1.53 2.4a7.6 7.6 0 1 0 12.88 6.79 7.6 7.6 0 0 0-8.6-9.44 7.6 7.6 0 0 0-4.43 2.96zm1.2 1.56l1.02-.03 1.02 1.02c.34.34.33.88-.02 1.25l-1.38 1.38c-.36.36-.88.36-1.24 0-.03 0-.05-.02-.08-.05-.33-.35-.62-.8-.88-1.27l-.2-.31-.69.04-.06.73c-.08.97-.08 1.76.14 2.18l-.14-.22c.21-.12.45-.19.7-.17l.2.31c.24-.38.49-.8.73-1.2z"></path>
  </svg>
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
