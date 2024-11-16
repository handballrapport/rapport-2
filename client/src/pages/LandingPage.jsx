import { Link } from "react-router-dom";
import image from "../../public/hero.jpg";
import { useEffect } from "react";

const LandingPage = () => {
  useEffect(() => {
    const heroText = document.querySelectorAll('.hero-text');
    const ctaButton = document.querySelector('.cta-button');

    heroText.forEach((text, index) => {
      text.style.animation = `fadeInUp 1s ease-out ${index * 0.3}s forwards`;
    });

    ctaButton.style.animation = 'bounceIn 1s ease-out 1s forwards';
  }, []);

  return (
    <div
      className="flex justify-center items-center bg-cover bg-center h-screen relative overflow-hidden"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent"></div>
      <div className="relative z-10 flex flex-col justify-center items-center gap-8 bg-black/60 backdrop-blur-md p-12 rounded-lg shadow-2xl border border-gray-700 max-w-3xl mx-auto">
        <h1 className="text-6xl font-extrabold text-white tracking-tight drop-shadow-lg text-center hero-text opacity-0">
          Welcome to HandballPro
        </h1>
        <p className="text-lg text-center text-gray-300 max-w-lg leading-relaxed hero-text opacity-0">
          Elevate your handball experience with HandballPro, the ultimate tool
          for managing your team, tracking performance, and staying ahead of
          the game.
        </p>
        <Link
          to="/dashboard"
          className="cta-button relative bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transition-all duration-300 ease-in-out text-white py-4 px-10 font-semibold rounded-full shadow-xl transform hover:scale-105 before:absolute before:inset-0 before:bg-gradient-to-r before:from-green-600 before:to-blue-700 before:rounded-full before:z-[-1] before:transition-transform before:duration-500 before:scale-0 hover:before:scale-110"
        >
          Get Started
        </Link>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-blue-600 animate-slowPulse"></div>
    </div>
  );
};

export default LandingPage;
