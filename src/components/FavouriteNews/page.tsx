'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios'; // Импортируем axios
import { CatalogOfProductsNewsFavourite, ProductI } from './CatalogOfNewsFavourite';

const minPrice = 0;
const maxPrice = 1000000;
const page = 1;

const Favorite: React.FC = () => {
  const [products, setProducts] = useState<ProductI[]>([]);
  const [error, setError] = useState<string | null>(null); // State for error handling

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/FavouriteLight`, {
        params: {
          page,
          limit: 9,
          name: 'Подвес',
          minPrice,
          maxPrice,
        },
      });
      setProducts(res.data.products);
    } catch (error) {
      const message = axios.isAxiosError(error) && error.response
        ? error.response.data.message
        : 'Ошибка при загрузке товаров';
      setError(message);
      console.error('Ошибка при загрузке товаров:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <motion.div
      className='ml-5 max-md:hidden'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length > 0 ? (
        <CatalogOfProductsNewsFavourite products={products} />
      ) : (
        <p>Товары не найдены.</p>
      )}
    </motion.div>
  );
};

export default Favorite;
