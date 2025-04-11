import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router v6 hook
import { FaMapMarkedAlt, FaPhoneAlt, FaCity, FaMailBulk } from 'react-icons/fa'; // Importing icons

const Order = () => {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Error state
  const [errors, setErrors] = useState({
    address: '',
    phone: '',
    zipCode: '',
    city: '',
  });

  const navigate = useNavigate(); // Hook to navigate

  // Validation function for the form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate address
    if (!address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/; // Simple check for a 10-digit phone number
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
      isValid = false;
    }

    // Validate zip code
    const zipCodeRegex = /^[0-9]{5}$/; // Assuming US Zip Code format
    if (!zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
      isValid = false;
    } else if (!zipCodeRegex.test(zipCode)) {
      newErrors.zipCode = 'Zip code must be 5 digits';
      isValid = false;
    }

    // Validate city
    if (!city.trim()) {
      newErrors.city = 'City is required';
      isValid = false;
    }

    setErrors(newErrors); // Update errors state
    return isValid; // Return if the form is valid
  };

  // Handle order confirmation
  const handleConfirmOrder = () => {
    // First, validate the form
    if (validateForm()) {
      setOrderPlaced(true);
      setTimeout(() => {
        // Simulate order processing and navigate to the home page
        navigate('/'); // After 2 seconds, redirect to the home page
      }, 2000);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-gray-900 to-black text-white min-h-screen flex flex-col justify-between">
      <h2 className="text-center font-serif text-4xl mb-8 text-yellow-500">Order Details</h2>

      {/* Delivery Address */}
      <div className="mb-6">
        <label htmlFor="address" className="flex items-center text-lg mb-2">
          <FaMapMarkedAlt className="mr-2 text-gray-400" /> Delivery Address
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
          placeholder="Enter your delivery address"
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      {/* Phone Number */}
      <div className="mb-6">
        <label htmlFor="phone" className="flex items-center text-lg mb-2">
          <FaPhoneAlt className="mr-2 text-gray-400" /> Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
          placeholder="Enter your phone number"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      {/* Zip Code */}
      <div className="mb-6">
        <label htmlFor="zipCode" className="flex items-center text-lg mb-2">
          <FaMailBulk className="mr-2 text-gray-400" /> Zip Code
        </label>
        <input
          type="text"
          id="zipCode"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
          placeholder="Enter your zip code"
        />
        {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
      </div>

      {/* City */}
      <div className="mb-6">
        <label htmlFor="city" className="flex items-center text-lg mb-2">
          <FaCity className="mr-2 text-gray-400" /> City
        </label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
          placeholder="Enter your city"
        />
        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
      </div>

      {/* Confirm Order Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleConfirmOrder}
          className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 focus:outline-none transition-all duration-300"
        >
          Confirm Order
        </button>
      </div>

      {/* Order Confirmation Dialog */}
      {orderPlaced && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm text-center">
            <h3 className="text-xl font-semibold text-green-600">Order Placed!</h3>
            <p className="text-gray-800">Your order has been placed successfully!</p>
            <button
              onClick={() => navigate('/')} // Use navigate for redirection
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
