'use client';
import React, { useEffect, useState } from 'react';
import { CircleUser, ShoppingBasket, LogOut, LogIn, Home, Info, MapPin, Search } from 'lucide-react';
import DropdownMenu from './CatalogDropdown';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showInfoRow, setShowInfoRow] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  const navLinks: NavLink[] = [
    { label: 'Каталог', href: '/products', icon: <ShoppingBasket size={24} /> },
    { label: 'Корзина', href: '/cart', icon: <ShoppingBasket size={24} /> },
    { label: 'Профиль', href: '/contact', icon: <CircleUser size={24} /> },
    { label: 'О нас', href: '/about', icon: <Info size={24} /> },
    { label: 'Заказы', href: '/orders', icon: <Home size={24} /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowInfoRow(window.scrollY < 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const storedCartCount = localStorage.getItem('cartCount');
    setCartCount(storedCartCount ? Number(storedCartCount) : 0);
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    toast.success('Вы вышли из аккаунта');
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    toast.error('Поиск временно недоступен');
  };

  return (
    <header className="fixed w-full z-50 shadow-lg bg-gradient-to-r from-black via-black to-black">
      <Toaster position="top-center" />

      {/* Top info row */}
      <div className={`bg-neutral-800 max-md:hidden shadow-md text-white text-xs py-1 transition-all duration-300 ${showInfoRow ? 'block' : 'hidden'}`}>
        <div className="container mx-auto flex flex-wrap items-center justify-evenly space-x-2">
          <div className="flex items-center">
            <MapPin size={16} className="mr-1" />
            <span>Москва</span>
          </div>
          <div className="text-sm whitespace-nowrap">г. Москва, МКАД 25-й</div>
          <div className="whitespace-nowrap">Оплата и доставка</div>
          <div className="whitespace-nowrap">Тел: +7 (929) 674-83-80</div>
          <div className="whitespace-nowrap">Тел: +7 (934) 999-29-09</div>
          <div className="whitespace-nowrap">Email: davidmonte00@mail.ru</div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto flex items-center justify-between p-4">
        <a className="text-2xl text-white font-bold" href="/">PalermoLight</a>

        {/* Center: Info and Working Hours */}
        <motion.div
          animate={{ opacity: showSearch ? 0 : 1, scale: showSearch ? 0.8 : 1 }}
          transition={{ duration: 0.3 }}
          className={`hidden lg:flex gap-5 items-center text-white text-sm ${showSearch ? 'hidden' : 'flex'}`}
        >
          <span>Бесплатная доставка по Москве</span>
          <span>Часы работы: Пн-Пт 10:00 - 21:00</span>
        </motion.div>

        {/* Right: Login/Logout, Cart, and Search */}
        <div className="flex items-center space-x-2">
          {/* Search Icon */}
          <button onClick={handleSearchClick} className="text-white">
            <Search size={24} />
          </button>

          {isLoggedIn ? (
            <button onClick={handleLogout} className="text-white flex items-center space-x-1">
              <LogOut size={20} />
              <span>Выйти</span>
            </button>
          ) : (
            <a href="/auth/register" className="text-white flex items-center space-x-1">
              <LogIn size={20} />
              <span>Войти</span>
            </a>
          )}

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden bg-white" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-label="Toggle Menu">
            <Image src={`/images/${isOpen ? 'close' : 'grid'}.svg`} alt="menu toggle" width={24} height={24} />
          </button>
        </div>
      </div>

      {/* White Divider */}
      <div className="w-full bg-white h-px"></div>

      {/* Mobile Navigation with Slide-In Animation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsOpen(false)}
            ></motion.div>

            {/* Sliding Menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="fixed inset-y-0 left-0 bg-black text-white w-3/4 max-w-xs z-50 p-5 space-y-4"
            >
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center text-3xl space-x-2 px-4 py-2 hover:bg-gray-700 transition-colors duration-200"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Navigation */}
      <motion.div
        animate={{ opacity: showSearch ? 0 : 1, scale: showSearch ? 0.8 : 1 }}
        transition={{ duration: 0.3 }}
        className={`hidden lg:flex items-center justify-center space-x-8 bg-black text-white py-4 ${showSearch ? 'hidden' : 'flex'}`}
      >
        <DropdownMenu />
        {navLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center space-x-2 hover:text-gray-600 transition-colors duration-200"
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </motion.div>
    </header>
  );
};

export default Header;
