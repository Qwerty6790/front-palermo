'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DeveloperComponents from '../components/DeveloperLinks';

const Footer: React.FC = () => {
  const [showUsers, setShowUsers] = useState(false);

  const toggleUsers = () => {
    setShowUsers(prev => !prev);
  };

  return (
    <footer className="bg-black text-white">
      <section className="pt-8">
        <div className="container mx-auto flex flex-col items-center p-4 md:p-8">
          <div className="w-full p-6 bg-black rounded-lg shadow-lg">
            <div className="flex flex-col lg:flex-row w-full divide-y lg:divide-y-0 lg:divide-x divide-gray-600">
              <div className="flex flex-col w-full p-4 space-y-6 lg:p-8">
                <h2 className="font-bold text-2xl text-neutral-400">Контакты</h2>
                <div>
                  <p className="text-gray-300">Фактический адрес:</p>
                  <p className="font-bold">г. Москва, МКАД 25-й км вл1, ТК-кст B-1.10 B-1.11, 10:00 - 21:00 без выходных</p>
                </div>
                <div>
                  <p className="text-gray-300">Контактные данные:</p>
                  <div className="flex flex-col">
                    <a href="tel:+79296748380" className="font-bold hover:text-neutral-300 transition">+7 (929) 674-83-80</a>
                    <a href="tel:+79349992909" className="font-bold hover:text-neutral-300 transition">+7 (934) 999-29-09</a>
                    <a href="mailto:davidmonte00@mail.ru" className="hover:text-neutral-300 transition">davidmonte00@mail.ru</a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full p-4 space-y-6 lg:p-8">
                <h2 className="font-bold text-2xl text-neutral-400">Информация</h2>
                <div className="flex flex-col space-y-4">
                  <a href="#" className="font-bold hover:text-neutral-300 transition">Фото Магазина</a>
                  <a href="#" className="font-bold hover:text-neutral-300 transition">Документация</a>
                  <a href="#" className="font-bold hover:text-neutral-300 transition">Новости</a>
                </div>
              </div>

              <div className="flex flex-col w-full p-4 space-y-6 lg:p-8">
                <h2 className="font-bold text-2xl text-neutral-400">Дополнительно</h2>
                <div className="flex flex-col space-y-4">
                  <a href="#" className="font-bold hover:text-neutral-300 transition">Новинки</a>
                  <a href="#" className="font-bold hover:text-neutral-300 transition">История Магазина</a>
                  <a href="#" className="font-bold hover:text-neutral-300 transition">Доставка</a>
                  <div className="flex flex-start items-center mt-6">
                    <button 
                      onClick={toggleUsers} 
                      className="font-bold text-white hover:underline"
                    >
                      Мы
                    </button>
                    <AnimatePresence>
                      {showUsers && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 bg-black p-4 rounded-lg shadow-lg"
                        >
                          <ul className="mt-2">
                            <DeveloperComponents />
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-12 lg:hidden">
              <iframe
                className="rounded-xl shadow-lg w-full"
                src="https://yandex.ru/map-widget/v1/?um=constructor%3Af7e61066fc8df105e24c6e8a657ce97759e4dde9863d97a90ebfbc838f8ef441&amp;source=constructor"
                width="950"
                height="375"
                frameBorder="0"
                title="Местоположение магазина"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
