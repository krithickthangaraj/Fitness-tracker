import React, { useState, useEffect, useRef } from 'react'; 
import { useCart } from './cartContext'; // Import the custom hook to access the cart context 
import gsap from 'gsap'; 


import gy1 from '../assets/gy1.jpg'; 
import gy2 from '../assets/gy2.jpg'; 
import gy3 from '../assets/gy3.jpg'; 
import gy4 from '../assets/gy4.jpg'; 
import s1 from '../assets/s1.jpg'; 
import s2 from '../assets/s2.jpg'; 
import s3 from '../assets/s3.jpg'; 
import s4 from '../assets/s4.jpg'; 
import s5 from '../assets/s5.jpg'; 
import s6 from '../assets/s6.jpg'; 
import s7 from '../assets/s7.jpg'; 
import s8 from '../assets/s8.jpg'; 

const Gymfit = () => {
  const [acknowledgeMessage, setAcknowledgeMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState([0, 100000]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const { addToCart } = useCart(); // Use the correct function name 
  const productRef = useRef([]);

  const handleAddToCart = (item) => {
    addToCart(item);
    setAcknowledgeMessage(`${item.title} has been added to your cart!`);
    setTimeout(() => {
      setAcknowledgeMessage('');
    }, 3000);
  };

  const products = [
    { img: gy1, title: "TREADMILL", price: 64000, category: "cardio" },
    { img: gy2, title: "ELLIPTICAL TRAINER", price: 72000, category: "cardio" },
    { img: gy3, title: "BIKES", price: 48000, category: "cardio" },
    { img: gy4, title: "NON-MOTORIZED", price: 56000, category: "cardio" },
    { img: s1, title: "PINLOADED", price: 40000, category: "strength" },
    { img: s2, title: "PLATELOADED", price: 48000, category: "strength" },
    { img: s3, title: "CROSS-FIT", price: 56000, category: "strength" },
    { img: s4, title: "NON-MOTORIZED", price: 32000, category: "strength" },
    { img: s5, title: "PILATES", price: 28000, category: "strength" },
    { img: s6, title: "BENCHES", price: 36000, category: "strength" },
    { img: s7, title: "ISOKINETIC", price: 64000, category: "strength" },
    { img: s8, title: "MAVERICK BENCHES", price: 60000, category: "strength" }
  ];

  const filteredProducts = products.filter(product => {
    // Filter by search query
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by price range
    const matchesPrice = product.price >= priceFilter[0] && product.price <= priceFilter[1];
    
    // Filter by category (Cardio or Strength)
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;

    return matchesSearch && matchesPrice && matchesCategory;
  });

  useEffect(() => {
    // GSAP animation to fade in and move up products on page load
    gsap.fromTo(
      productRef.current, 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: 'power1.out' }
    );
  }, []);

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white font-sans min-h-screen">

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
              max="100000" 
              value={priceFilter[0]} 
              onChange={(e) => setPriceFilter([Number(e.target.value), priceFilter[1]])} 
              className="w-full"
            />
            <input 
              type="range" 
              min="0" 
              max="100000" 
              value={priceFilter[1]} 
              onChange={(e) => setPriceFilter([priceFilter[0], Number(e.target.value)])} 
              className="w-full mt-2"
            />
          </div>

          <div className='flex space-x-4'>
            <button 
              onClick={() => setCategoryFilter('cardio')}
              className={`px-4 py-2 ${categoryFilter === 'cardio' ? 'bg-red-700' : 'bg-red-600'} text-white rounded-lg hover:bg-red-700`}>
              Cardio
            </button>
            <button 
              onClick={() => setCategoryFilter('strength')}
              className={`px-4 py-2 ${categoryFilter === 'strength' ? 'bg-red-700' : 'bg-red-600'} text-white rounded-lg hover:bg-red-700`}>
              Strength
            </button>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="p-10">
        <h2 className="text-center font-extrabold text-5xl mb-10 text-red-600 tracking-wide">
          {categoryFilter ? categoryFilter.toUpperCase() : 'ALL PRODUCTS'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map(({ img, title, price }, index) => (
            <div
              key={index}
              ref={(el) => (productRef.current[index] = el)} 
              className="flex flex-col items-center bg-gray-800 bg-opacity-90 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 p-4"
            >
              <img src={img} alt={title} className="h-48 w-48 object-cover rounded-md mb-2" />
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-lg font-bold text-red-600">₹{price}</p>
              <button 
                onClick={() => handleAddToCart({ img, title, price })}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Acknowledgment Message */}
      {acknowledgeMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-700 via-red-600 to-black text-white py-4 px-6 rounded-lg shadow-2xl max-w-lg w-full flex items-center space-x-4 transition-all duration-500 ease-in-out transform hover:scale-105">
          <svg className="w-10 h-10 text-yellow-400 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 110-20 10 10 0 010 20z" clipRule="evenodd" />
          </svg>
          <div className="text-center">
            <h3 className="font-bold text-xl mb-2">{acknowledgeMessage}</h3>
            <p className="text-sm text-gray-300 italic">Item added to your cart!</p>
          </div>
          <button 
            onClick={() => setAcknowledgeMessage('')}
            className="ml-4 bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-black"
          >
            Dismiss
          </button>
        </div>
      )}

    </div>
  );
};

export default Gymfit;
