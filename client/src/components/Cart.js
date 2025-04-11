import React, { useState } from 'react';
import { useCart } from './cartContext'; // Assuming you're using context to manage the cart
import { Link } from 'react-router-dom'; // Import Link for routing
import jsPDF from 'jspdf'; // Import jsPDF for generating PDFs

const Cart = () => {
  const { cart, removeItemFromCart } = useCart(); // Getting cart items from context
  const [acknowledgeMessage, setAcknowledgeMessage] = useState('');

  // Calculate total price of items in the cart
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => {
        const price = parseFloat(item.price); // Directly parse the price as a number
        return total + price;
      }, 0)
      .toFixed(2); // Format to 2 decimal places
  };

  // Handle removing an item from the cart
  const handleRemoveFromCart = (item) => {
    removeItemFromCart(item);
    setAcknowledgeMessage(`${item.title} has been removed from your cart!`);
    setTimeout(() => {
      setAcknowledgeMessage('');
    }, 3000);
  };

  // Generate the bill as a PDF
  const generateBill = () => {
    const doc = new jsPDF();

    // Title for the PDF
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Invoice', 105, 20, { align: 'center' });

    // Add a line separator
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);

    // Add Date and Time of Bill Generation
    const currentDate = new Date().toLocaleString();
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${currentDate}`, 10, 30);

    // Line separator before item list
    doc.setLineWidth(0.5);
    doc.line(10, 35, 200, 35);

    // Item Details Section
    let yPosition = 45; // Starting Y position for items

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    // Loop through cart items and display them
    cart.forEach((item) => {
      const itemName = item.title || 'No Title';
      const itemDescription = item.description || 'No Description';
      const itemPrice = item.price ? `₹${item.price}` : '₹0.00'; // Fallback if price is missing

      // Item Name (Bold for visibility)
      doc.setFont('helvetica', 'bold');
      doc.text(`Item: ${itemName}`, 10, yPosition);

      // Item Description (Normal)
      doc.setFont('helvetica', 'normal');
      doc.text(`Description: ${itemDescription}`, 10, yPosition + 6);

      // Item Price (Normal)
      doc.text(`Price: ${itemPrice}`, 10, yPosition + 12);

      // Space between items
      yPosition += 18; // Add extra spacing between items
    });

    // Add a line separator before the total amount section
    doc.setLineWidth(0.5);
    doc.line(10, yPosition, 200, yPosition);
    yPosition += 5;

    // Total Amount Section (Bold and larger font size)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`Total Amount: ₹${calculateTotal()}`, 10, yPosition);

    // Add a footer message
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100); // Grey color for footer
    doc.text('Thank you for shopping with us!', 105, yPosition + 10, { align: 'center' });

    // Save the PDF
    doc.save('bill.pdf');
  };

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h2 className="text-center font-serif text-4xl mb-10 text-red-600">Your Cart</h2>

      {/* Acknowledgment Message for Item Removal */}
      {acknowledgeMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-700 via-red-600 to-black text-white py-4 px-6 rounded-lg shadow-2xl max-w-lg w-full flex items-center space-x-4 transition-all duration-500 ease-in-out">
          <div className="text-center w-full">
            <h3 className="font-bold text-xl mb-2">{acknowledgeMessage}</h3>
            <p className="text-sm text-gray-300 italic">Item has been removed from your cart!</p>
          </div>
          <button
            onClick={() => setAcknowledgeMessage('')}
            className="ml-4 bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-black"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Cart Items */}
      {cart.length === 0 ? (
        <p className="text-center text-xl text-gray-300">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <img
                src={item.img}
                alt={item.title}
                className="h-48 w-48 object-cover rounded-md mb-4 shadow-md"
              />
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-lg font-bold text-yellow-300">₹{item.price}</p>
              <p className="text-sm text-gray-400">{item.description}</p>

              <button
                onClick={() => handleRemoveFromCart(item)}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 focus:outline-none"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Cart Summary Section */}
      <div className="mt-10 flex justify-between items-center bg-gray-900 p-4 rounded-lg shadow-lg">
        <div className="text-white font-semibold">
          <p>Total Items: <span className="font-bold">{cart.length}</span></p>
          <p className="mt-2 text-lg text-yellow-300">Total: ₹{calculateTotal()}</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Generate Bill Button */}
          <button
            onClick={generateBill}
            className="px-8 py-3 bg-orange-600 text-white rounded-lg shadow-lg hover:bg-orange-700 focus:outline-none"
          >
            Generate Bill
          </button>

          {/* Proceed to Pay Button */}
          <Link to="/order">
            <button
              className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none"
            >
              Proceed to Pay
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
