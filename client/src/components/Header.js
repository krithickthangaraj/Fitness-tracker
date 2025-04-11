import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import Auth from "../utils/auth";
import Chatbot from './Chatbot';  // Ensure the Chatbot component is imported correctly
import heart from "../assets/images/heart.png";
import '../App.css'
import { Outlet, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const loggedIn = Auth.loggedIn();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const handleCartClick = () => {
    navigate('/cart');
  };

  // Navigation links for logged-in users
  const loggedInLinks = [
    { to: '/exercise', label: 'Exercise' },
    { to: '/history', label: 'History' },
    { to: '/homefit', label: 'Home Fit' },
    { to: '/gymfit', label: 'Gym Fit' },
  ];

  // Default links for non-logged-in users
  const defaultLinks = [
    { to: '/login', label: 'Login' },
    { to: '/signup', label: 'Sign Up' },
  ];

  const navLinks = loggedIn ? loggedInLinks : defaultLinks;

  return (
    <>
      <Navbar collapseOnSelect expand="sm" variant="dark" bg={loggedIn && !isHomePage ? "dark" : null}>
        <Navbar.Brand as={Link} to="/" className={`brand d-flex align-items-center ${loggedIn ? 'brand-logged' : 'brand-new'}`}>
          <img alt="heart" style={{ display: "inline" }} src={heart} className="heart-icon" />
          FitTrack
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
          <Nav>
            {navLinks.map((link) => (
              <Nav.Link as={Link} to={link.to} key={link.to} eventKey={link.to}>
                {link.label}
              </Nav.Link>
            ))}
            {loggedIn && (
              <>
                <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                
                <button
                  onClick={handleCartClick}
                  className="bg-red-600 text-white ml-5 px-4 py-1 rounded-full hover:bg-red-700 shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 4h13a1 1 0 01.92 1.39l-2.72 6.09a1 1 0 01-.92.61H9.41l-.81 2H19a1 1 0 110 2H8.03a1 1 0 01-.92-.61L3.53 6H2a1 1 0 110-2h2.31l1.38 3h13.14l2.1-4.7A1 1 0 0019.15 2H6.5L5.2 0H2a1 1 0 110-2h4a1 1 0 01.9.56L9 4zM7 17a1 1 0 100 2 1 1 0 000-2zm9 0a1 1 0 100 2 1 1 0 000-2z" />
                  </svg>
                </button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
     
      {/* Chatbot Component */}
      {loggedIn && <Chatbot />}
    </>
  );
}
