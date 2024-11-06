'use client';
import React, { useEffect, useState } from 'react';
import { CircleUser } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // Удаление имени пользователя при выходе
    checkUserLogged();
  };
 
  const checkUserLogged = () => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setUsername(localStorage.getItem('username')); // Получение имени пользователя
  };

  useEffect(() => {
    checkUserLogged();
  }, []);

  return (
    <motion.section
      className="py-20 dark:bg-black dark:text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mt-36 mx-auto">
        <div className="p-4 mx-auto text-center md:px-10 lg:px-32 xl:max-w-3xl">
          <h1 className="text-2xl font-bold">Ваш Профиль</h1>
          {isLoggedIn && (
            <p className="text-lg text-gray-500 mt-2">Приятных вам покупок!</p> // Отображается только для авторизованных пользователей
          )}
          <div className="text-center p-4 rounded-lg shadow-md border-2 border-white mt-6">
            {isLoggedIn ? (
              <>
                <p className="text-lg font-semibold text-green-500">Вы вошли в аккаунт</p>
                <div className="flex flex-col items-center mt-4">
                  <a href="/profile" className="flex items-center justify-center text-white mt-2">
                    <CircleUser className="mr-2" color="white" size={40} />
                    <span className="text-lg">{username}</span> {/* Имя пользователя вместо "Мой профиль" */}
                  </a>
                  <button 
                    onClick={handleLogout} 
                    className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition duration-300"
                  >
                    Выйти
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-red-500">Войдите в аккаунт</p>
                <div className="flex flex-col items-center mt-4">
                  <a href="/auth/register" className="flex items-center justify-center text-gray-400 underline">
                    <CircleUser className="mr-2" color="white" size={40} />
                    <span>Войти</span>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Profile;
