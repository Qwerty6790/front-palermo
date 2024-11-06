'use client';
import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const AnimatedCard = ({
  title,
  description,
  images,
}: {
  title: string;
  description: string;
  images: string[];
}) => {
  const controls = useAnimation();
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          controls.start('visible');
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [controls]);

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
      }}
      className="flex flex-col items-center text-center rounded-lg shadow-md bg-transparent px-6"
    >
      <h3 className="text-3xl font-bold dark:text-white mb-2">{title}</h3>
      <p className="text-white dark:text-white mb-4">{description}</p>
      <div className="flex space-x-4 overflow-hidden">
        {images.map((image, idx) => (
          <div
            key={idx}
            className="w-32 h-48 bg-cover bg-center rounded-lg transition-transform duration-500 ease-out transform perspective-1000 hover:rotate-x-5 hover:rotate-y-5"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              perspective: '1000px',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const About: React.FC = () => {
  const collections = [
    {
      title: "Люстры Поставщиков",
      description: "Обзор современных люстр от лучших брендов.",
      images: ["/images/Side.png", "/images/Side4.png"],
    },
    {
      title: "Светильники Интерьеров",
      description: "Идеи и новинки светильников для вашего дома.",
      images: ["/images/Side2.png", "/images/Side5.png"],
    },
    {
      title: "Тренды Освещения",
      description: "Современные решения в освещении и декоре.",
      images: ["/images/Side3.png", "/images/Side6.png"],
    },
    {
      title: "Эксклюзивные Коллекции",
      description: "Уникальные предложения от популярных дизайнеров.",
      images: ["/images/Side7.png", "/images/Side.png"],
    },
  ];

  return (
    <section className="dark:text-white">
      <div className="container max-w-5xl px-4 py-12 mx-auto text-center">
        <motion.h1
          className="text-5xl mt-56 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-neutral-300 to-neutral-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          Коллекции Люстр и Светильников
        </motion.h1>
        <motion.p
          className="text-lg mt-4 text-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Исследуйте наши тщательно подобранные коллекции освещения, которые добавят стиль вашему интерьеру.
        </motion.p>
      </div>

      <div className="flex justify-center space-x-4 py-8">
        {["/images/side8.png", "/images/side9.png"].map((image, idx) => (
          <div
            key={idx}
            className="w-32 h-48 bg-cover bg-center rounded-lg shadow-md transition-transform duration-500 transform hover:scale-105"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          />
        ))}
      </div>

      <div className="container max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 py-12">
        {collections.map((collection, idx) => (
          <AnimatedCard
            key={idx}
            title={collection.title}
            description={collection.description}
            images={collection.images}
          />
        ))}
      </div>
    </section>
  );
};

export default About;
