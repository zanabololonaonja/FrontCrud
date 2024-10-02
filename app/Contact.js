// components/Contact.js
"use client";
import React from 'react';
import './Contact.css'; // Assurez-vous que le chemin est correct

const Contact = () => {
  return (
    <div>
      {/* Contenu de la section Contact */}
      <h2>Contact Us</h2>
      <p>Get in touch with us for more information.</p>
      
      {/* Section des vagues */}
      <div className="ocean">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </div>
  );
}

export default Contact;
