'use client'
import React from 'react';
import { Analytics } from "@vercel/analytics/react"
import { motion } from 'framer-motion';
import ImageHoverEffect from '../components/Banner';
import Denkirs from '@/components/DenkirsNews/page'; 
import Favorite from '@/components/FavouriteNews/page'; 
import Footer from '@/components/Footer';

export default function Home() {
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className=""> {/* Full-width container */}
      <Analytics/>
      <motion.div
        className="w-full flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        transition={{ duration: 0.5 }}
      >
        <ImageHoverEffect />
        

      
      </motion.div>

      {/* Image grid section */}
      <div className="hidden md:flex w-full justify-center mt-4">
        <motion.div
          className="flex flex-col items-center" 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }} // Delay for smooth appearance
        >
          {/* Your image grid or any other content can go here */}
        </motion.div>
        
      </div>
      <Footer/>
    </div>
  );
};

