'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import axios, { AxiosError } from 'axios'; // Импортируем axios и AxiosError
import { OrderI } from '../../types/interfaces'; // Импортируем интерфейс Order
import { ClipLoader } from 'react-spinners'; // Импортируем спиннер

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderI[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Добавим состояние загрузки

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setOrders(response.data.orders);
        setLoading(false); // Заказы загружены, снимаем состояние загрузки
      } catch (error) {
        setLoading(false); // Ошибка при загрузке, снимаем состояние загрузки
        if (error instanceof AxiosError && error.response?.status === 403) {
          toast.error('Пожалуйста, войдите в аккаунт снова.');
          localStorage.removeItem('token');
        } else {
          toast.error('Ошибка при загрузке заказов');
          console.error(error);
        }
      }
    };

    fetchOrders();
  }, []);

  const handleOpenModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${selectedOrderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setOrders((prevOrders) => prevOrders.filter(order => order._id !== selectedOrderId));
      toast.success('Заказ успешно отменен');
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 403) {
        toast.error('Пожалуйста, войдите в аккаунт снова.');
        localStorage.removeItem('token'); 
      } else {
        console.error(error);
        toast.error('Ошибка при отмене заказа');
      }
    } finally {
      handleCloseModal();
    }
  };

  return (
    <motion.section
      className="py-20 bg-black text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto mt-20">
        <div className="p-4 mx-auto md:px-10 lg:px-32 xl:max-w-3xl">
          <h1 className="text-2xl font-bold text-center mb-6">Заказы</h1>

          <p className="mb-6 text-center text-gray-400">
            Нажмите на заказ ID, чтобы увидеть детали заказа.
          </p>

          {loading ? (
            <div className="flex justify-center items-center">
              <ClipLoader color="#fff" size={50} />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center">У вас еще нет заказов.</div>
          ) : (
            <div className="flex flex-col mt-4 space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col bg-stone-950 border border-gray-600 rounded-lg shadow-lg p-4 transition-all duration-300 hover:shadow-xl cursor-pointer"
                >
                  <Link href={`/orders/${order._id}`} className="flex-grow hover:underline">
                    <h2 className="text-lg font-semibold text-white mb-2">Заказ ID: {order._id}</h2>
                    <p className="text-gray-300">Общая сумма: {order.totalAmount} ₽</p>
                    <p className="text-gray-300">Статус: {order.status}</p>
                  </Link>
                  <div className="mt-4">
                    <button
                      className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(order._id);
                      }}
                    >
                      Отменить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-black">Подтверждение отмены заказа</h2>
                <p className="text-black">Вы уверены, что хотите отменить этот заказ?</p>
                <div className="flex justify-end mt-4">
                  <button className="px-4 py-2 mr-2 bg-gray-300 rounded" onClick={handleCloseModal}>
                    Отмена
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleCancelOrder}>
                    Подтвердить
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.section>
  );
};

export default Orders;
