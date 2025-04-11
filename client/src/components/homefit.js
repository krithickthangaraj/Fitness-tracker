import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCart } from './cartContext';

// Import images
import h1 from '../assets/h1.jpg';
import dumbbellImg from '../assets/dumbbell.jpg';
import plateImg from '../assets/plate.jpg';
import barbellImg from '../assets/barbell.jpg';
import kettlebellImg from '../assets/kettlebell.jpg';
import resistanceBandImg from '../assets/resistance-band.jpg';
import yogaMatImg from '../assets/yoga-mat.jpg';
import pullUpBarImg from '../assets/pull-up-bar.jpg';
import jumpRopeImg from '../assets/jump-rope.jpg';
import abRollerImg from '../assets/ab-roller.jpg';
import foamRollerImg from '../assets/foam-roller.jpg';

const HomeFit = () => {
  const imgRef = useRef(null);
  const productRef = useRef([]);
  const [acknowledgeMessage, setAcknowledgeMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState([0, 5000]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const { addToCart } = useCart();

  // Product data
  const products = [
    { img: dumbbellImg, title: "Dumbbell Set 5kg", price: 2000, category: "strength" },
    { img: plateImg, title: "Weight Plate 10kg", price: 1500, category: "strength" },
    { img: barbellImg, title: "Barbell 7ft", price: 3000, category: "strength" },
    { img: kettlebellImg, title: "Kettlebell 8kg", price: 1200, category: "strength" },
    { img: resistanceBandImg, title: "Resistance Bands", price: 800, category: "strength" },
    { img: yogaMatImg, title: "Yoga Mat", price: 600, category: "strength" },
    { img: pullUpBarImg, title: "Pull-up Bar", price: 1700, category: "strength" },
    { img: jumpRopeImg, title: "Jump Rope", price: 300, category: "cardio" },
    { img: abRollerImg, title: "Ab Roller", price: 900, category: "strength" },
    { img: foamRollerImg, title: "Foam Roller", price: 500, category: "strength" }
  ];

  // Filter products based on search, price range, and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceFilter[0] && product.price <= priceFilter[1];
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;

    return matchesSearch && matchesPrice && matchesCategory;
  });

  // Handle add to cart
  const handleAddToCart = (item) => {
    addToCart(item);
    setAcknowledgeMessage(`${item.title} has been added to your cart!`);
    setTimeout(() => {
      setAcknowledgeMessage('');
    }, 3000);
  };

  useEffect(() => {
    // GSAP animation for hero image
    gsap.fromTo(imgRef.current, { opacity: 0, x: -1000 }, { opacity: 1, x: 0, duration: 2, ease: 'power1.inOut' });

    // GSAP animation for product items
    gsap.fromTo(
      productRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: 'power1.out' }
    );
  }, []);

  return (
    <div className="bg-black text-white font-sans">

      {/* Hero Section with GSAP Animation */}
      <div className="relative w-full h-[50vh]">
        <img
          ref={imgRef}
          src={h1}
          alt="Home Fitness"
          className="w-full h-full object-cover opacity-75"
        />
      </div>

      {/* Search and Filter Section */}
      <div className="p-10 flex justify-between items-center bg-gray-800 bg-opacity-70">
        <div className="flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="px-4 py-2 bg-gray-900 text-white rounded-l-lg"
          />
          <button
            onClick={() => setCategoryFilter('')}
            className="px-4 py-2 bg-red-600 text-white rounded-r-lg hover:bg-red-700 ml-2">
            Clear Filters
          </button>
        </div>

        {/* Filter Options */}
        <div className="flex items-center space-x-4">
          <div>
            <label className="text-white">Price Range: ₹{priceFilter[0]} - ₹{priceFilter[1]}</label>
            <input
              type="range"
              min="0"
              max="5000"
              value={priceFilter[0]}
              onChange={(e) => setPriceFilter([Number(e.target.value), priceFilter[1]])}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="5000"
              value={priceFilter[1]}
              onChange={(e) => setPriceFilter([priceFilter[0], Number(e.target.value)])}
              className="w-full mt-2"
            />
          </div>

         
        </div>
      </div>

      {/* Product Section */}
      <div className="p-10">
        <h2 className="text-center font-extrabold text-5xl mb-10 text-red-600 tracking-wide">Home fitness</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map(({ img, title, price }, index) => (
            <div
              key={index}
              ref={(el) => (productRef.current[index] = el)} // Attach each product to the ref
              className="flex flex-col items-center bg-gray-800 rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 p-4"
            >
              <img
                src={img}
                alt={title}
                className="h-48 w-48 object-cover rounded-md mb-2"
              />
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-lg font-bold text-yellow-300">₹{price}</p>
              <button
                onClick={() => handleAddToCart({ img, title, price })}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Acknowledgment Message */}
      {acknowledgeMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-700 via-red-600 to-black text-white py-4 px-6 rounded-lg shadow-2xl max-w-lg w-full flex items-center space-x-4 transition-all duration-500 ease-in-out">
          <svg
            className="w-10 h-10 text-yellow-400 animate-pulse"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 110-20 10 10 0 010 20z"
              clipRule="evenodd"
            />
          </svg>

          <div className="text-center">
            <h3 className="font-bold text-xl mb-2">{acknowledgeMessage}</h3>
            <p className="text-sm text-gray-300 italic">Item added to your cart!</p>
          </div>

          <button
            onClick={() => setAcknowledgeMessage('')}
            className="ml-4 bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-black focus:outline-none transition-all"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeFit;
