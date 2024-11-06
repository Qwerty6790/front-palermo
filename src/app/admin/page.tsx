'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ProductI } from '../../types/interfaces';

interface Order {
    _id: string;
    status: string[];
    products: ProductI[];
    userId: string; // Добавлено поле userId
}

const statusOptions = ['В обработке', 'Готов к выдаче', 'Выдан', 'Отменён'];

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/all-orders`);
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Ошибка при загрузке заказов', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, { status: newStatus });
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: [newStatus] } : order
                )
            );
        } catch (error) {
            console.error('Ошибка при обновлении статуса', error);
        }
    };

    const updateProductStatus = async (orderId: string, article: string, newStatus: string) => {
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/products/${article}/status`, { status: newStatus });
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId
                        ? {
                              ...order,
                              products: order.products.map(product =>
                                  product.article === article ? { ...product, status: newStatus } : product
                              ),
                          }
                        : order
                )
            );
        } catch (error) {
            console.error('Ошибка при обновлении статуса товара', error);
        }
    };

    const calculateTotalPrice = (products: ProductI[]): number => {
        return products.reduce((total, product) => total + (product.price * product.quantity), 0);
    };

    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center text-lg text-white">Загрузка...</div>;

    return (
      <div className="max-w-5xl mx-auto  p-8 text-white bg-black rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-center mb-8">Управление заказами</h1>
          <input
              type="text"
              placeholder="Поиск по ID заказа"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full p-4 mb-6 border border-gray-600 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <ul className="space-y-6">
              {filteredOrders.map(order => (
                  <li key={order._id} className="relative p-6 border border-gray-700 rounded-lg bg-black  shadow-md">
                      <h2 className="text-3xl font-semibold">Заказ ID: {order._id}</h2>
                      <p className="text-gray-300">Статус: {order.status.join(', ')}</p>
                      <p className="text-gray-300">Общая цена: <span className="font-bold text-green-400">{calculateTotalPrice(order.products)}₽</span></p>
                      <Link href={`/users/${order.userId}`} className="absolute top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
                          Профиль заказчика
                      </Link>
                      <select
                          className="mt-4 p-2 border border-gray-600 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                          onChange={e => updateOrderStatus(order._id, e.target.value)}
                      >
                          {statusOptions.map(status => (
                              <option key={status} value={status}>
                                  {status}
                              </option>
                          ))}
                      </select>
                      <h3 className="mt-4 text-lg font-semibold">Товары:</h3>
                      <ul className="space-y-3">
                          {order.products.map(product => (
                              <li key={product.article} className="flex justify-between items-center p-4 border border-gray-700 rounded bg-gray-800">
                                  <div>
                                      <p className="text-gray-200 underline">
                                          <Link href={`/products/${product.source}/${product.article}`}>
                                              {product.name}
                                          </Link>
                                      </p>
                                      <p className="text-gray-400">Артикул: {product.article}</p>
                                      <p className="text-gray-400">Поставщик: {product.source}</p>
                                      <p className="text-gray-400">Количество: {product.quantity}</p>
                                      <p className="text-gray-400">Цена: {product.price}₽</p>
                                  </div>
                                  <select
                                      className="ml-4 p-1 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                                      onChange={e => updateProductStatus(order._id, product.article, e.target.value)}
                                  >
                                      {statusOptions.map(status => (
                                          <option key={status} value={status}>
                                              {status}
                                          </option>
                                      ))}
                                  </select>
                              </li>
                          ))} 
                      </ul>
                  </li>
              ))}
          </ul>
      </div>
  );
};

export default AdminOrders;
