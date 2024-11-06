'use client'
import React from 'react';
import { motion } from 'framer-motion';

const Brands = () => {
  const brands = [
    { src: './images/LightStar.png', alt: 'LightStar' },
    { src: './images/KinkLight.png', alt: 'KinkLight' },
    { src: './images/Favourite.png', alt: 'Favourite' },
    { src: './images/Werkel.png', alt: 'Werkel' },
    { src: './images/Ambrella.png', alt: 'Umbrella' },
    { src: './images/EKS.png', alt: 'EKS' },
    { src: './images/OdeonLight.png', alt: 'OdeonLight' },
    { src: './images/Electrostandart.png', alt: 'Electrostandart' },
    { src: './images/Arte Lamp.png', alt: 'Arte Lamp' },
    { src: './images/Arlight.png', alt: 'Arlight' },
    { src: './images/Stool.png', alt: 'Stool' },
    { src: './images/Denkirs.png', alt: 'Denkirs' },
    { src: './images/LightStar.png', alt: 'LightStar' },
    { src: './images/KinkLight.png', alt: 'KinkLight' },
    { src: './images/Favourite.png', alt: 'Favourite' },
    { src: './images/Werkel.png', alt: 'Werkel' },
    { src: './images/Ambrella.png', alt: 'Umbrella' },
    { src: './images/EKS.png', alt: 'EKS' },
    { src: './images/OdeonLight.png', alt: 'OdeonLight' },
    { src: './images/Electrostandart.png', alt: 'Electrostandart' },
    { src: './images/Arte Lamp.png', alt: 'Arte Lamp' },
    { src: './images/Arlight.png', alt: 'Arlight' },
    { src: './images/Stool.png', alt: 'Stool' },
    { src: './images/Denkirs.png', alt: 'Denkirs' },
    { src: './images/Favourite.png', alt: 'Favourite' },
    { src: './images/Werkel.png', alt: 'Werkel' },
    { src: './images/Ambrella.png', alt: 'Umbrella' },
    { src: './images/EKS.png', alt: 'EKS' },
    { src: './images/OdeonLight.png', alt: 'OdeonLight' },
    { src: './images/Electrostandart.png', alt: 'Electrostandart' },
    { src: './images/Arte Lamp.png', alt: 'Arte Lamp' },
    { src: './images/Arlight.png', alt: 'Arlight' },
    { src: './images/Stool.png', alt: 'Stool' },
    { src: './images/Denkirs.png', alt: 'Denkirs' },
  ];

  return (
    <section className="relative mt-30 bg-transparent sm:py-16 lg:py-24 lg:pt-36">
      <div className="grid items-center max-w-4xl opacity-80 grid-cols-2 gap-4 mx-auto mt-12 md:grid-cols-4">
        {brands.map((brand, index) => (
          <motion.div
            key={index}
            className="bg-white h-12 flex shadow-lg items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer"
            initial={{ opacity: 0, y: 20 }} // Start with opacity 0 and slight upward offset
            animate={{ opacity: 1, y: 0 }} // Animate to full opacity and original position
            transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered animation based on index
          >
            <img
              className="object-contain w-full h-12 mx-auto"
              src={brand.src}
              alt={brand.alt}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Brands;
