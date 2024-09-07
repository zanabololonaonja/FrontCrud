"use client";
import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import './WhyChooseUs.css'; // Make sure this file exists with necessary styles

const items = [
  <div className="reason-item" key="1">
    <h3>Reliability</h3>
    <p>Our platform offers maximum security for your data with regular backups and protection against unauthorized access.</p>
  </div>,
  <div className="reason-item" key="2">
    <h3>Ease of Use</h3>
    <p>We designed our interface to be intuitive and easy to use, even for less experienced users.</p>
  </div>,
  <div className="reason-item" key="3">
    <h3>Accessibility</h3>
    <p>Access your information from anywhere and on any device, whether it's a computer, tablet, or smartphone.</p>
  </div>,
  <div className="reason-item" key="4">
    <h3>Innovation</h3>
    <p>We are committed to using the latest technologies to offer advanced features and an exceptional user experience.</p>
  </div>
];

const WhyChooseUs = () => {
  return (
    <div className="why-choose-us-container">
      <h1 className='WHAT'>WHAT?</h1> {/* Corrected <h> to <h1> */}
      <h2>Why Choose Us</h2>
      <div className="reasons-container">
        {items}
      </div>
    </div>
  );
}

const WhyChooseUsCarousel = () => {
  return (
    <div>
      <h2>Why Choose Us</h2>
      <AliceCarousel
        autoPlay
        autoPlayInterval={3000}
        infinite
        disableDotsControls
        disableButtonsControls
        items={items}
      />
    </div>
  );
};

export default WhyChooseUs;
