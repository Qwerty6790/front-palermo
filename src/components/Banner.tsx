'use client';

import { useState, useEffect } from 'react';

export default function ImageHoverEffect() {
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(200);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);

  const texts = ['Выбор светильников', 'Уникальный дизайн', 'Все на PalermonLight'];
  const slides = [
    { beforeImage: './images/do5.png', afterImage: './images/posle5.png' },
  ];

  // Typing animation effect
  useEffect(() => {
    const handleTyping = () => {
      const currentTextIndex = loopNum % texts.length;
      const fullText = texts[currentTextIndex];

      setCurrentText((prev) =>
        isDeleting ? fullText.substring(0, prev.length - 1) : fullText.substring(0, prev.length + 1)
      );

      setTypingSpeed(isDeleting ? 100 : 500);

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 500);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
      }
    };

    const typingInterval = setInterval(handleTyping, typingSpeed);
    return () => clearInterval(typingInterval);
  }, [currentText, isDeleting, loopNum, typingSpeed]);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      handleNextSlide();
    }, 5500);

    return () => clearInterval(slideInterval);
  }, []);

  const handlePrevSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setFade(true);
    }, 500);
  };

  const handleNextSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setFade(true);
    }, 500);
  };

  return (
    <div className="relative lg:mt-32 bg-black h-[750px] w-full overflow-hidden flex items-center justify-center">
      <div className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}>
        {/* Primary Image */}
        <img
          src={slides[currentSlide].beforeImage}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover transition duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-105 group-hover:brightness-150"
        />
        {/* Hover Image */}
        <img
          src={slides[currentSlide].afterImage}
          alt="After"
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out group-hover:scale-105"
        />

        {/* Centered Text and Button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 space-y-4 text-center">
          <div className="text-white text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
            {currentText}
          </div>
          <div className="text-white text-5xl font-extrabold mb-4">PalermoLight</div>
          <a
            href="/products"
            className="bg-white text-black px-8 py-4 text-1xl font-semibold rounded-lg shadow-lg transition transform duration-500 hover:scale-110 hover:bg-gray-100"
          >
            Подробнее в каталоге
          </a>
        </div>
      </div>
    </div>
  );
}
