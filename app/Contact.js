// components/Footer.js
"use client";
import { RiMapPinLine, RiPhoneLine, RiMailLine, RiFacebookLine } from 'react-icons/ri';
import React from 'react';
import './Contact.css'; // Assurez-vous que le chemin est correct
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  return (
    <footer className="footer">
      <div className="footer__logo">
      <br />
        <img   src="/images/LOGO.png" style={{ marginLeft:'180px' }} alt="Logo" />
      </div>
      <div >
      <hr  className='tsipika'/>
      </div> 
      <br />         <br />           <br />  
      <div className="footer__text">
      
    
      <p>Your trust is our priority.</p>
<p>Follow us to stay updated on the latest news.</p>
<p>We are committed to providing you with the best service possible.</p>
<p>For any questions, feel free to contact us!</p>

      </div>

      <div className="footer__text2">
      
      <h3>Our servces</h3>
      
              <p style={{marginTop: '14px'}} >Home</p>
        <p>About Us</p>
        <p>Services</p>
        <p>Features</p>
      </div>

      
      <div className="footer__text3">
      <h3 style={{marginLeft: '960px',marginTop:'-173px'}}>Contact Us</h3>
      <br />   
      <div className="gpt3__footer-links_logo" >
        <div className="akaiky">   
          <RiPhoneLine size={22} color='black' className="elanelana"  style={{marginLeft: '-150px',marginTop: '-24px'}} />
          <p  style={{marginLeft: '4px',marginTop: '-22px'}}>(240) 310-4767</p>
        </div>
    
        
       
    
      </div>
     
         
      <div className="gpt3__footer-links_logo" >
        <div className="akaiky">
          <RiFacebookLine size={22} color='black' className="elanelana"  style={{marginLeft: '-150px',marginTop: '-15px'}} />
          <p  style={{marginLeft: '4px',marginTop: '-15px'}}>Lemursys</p>
        </div>
  
        
       
    
      </div>
      <div className="gpt3__footer-links_logo" >
        <div className="akaiky">
          <RiMailLine size={22} color='black' className="elanelana"  style={{marginLeft: '-90px',marginTop: '-15px'}} />
          <p  style={{marginLeft: '4px',marginTop: '-15px'}}>office@lemursys.com</p>
        </div>

        
        <div className="gpt3__footer-links_logo" >
        <div className="akaiky">
          <RiMapPinLine  size={22} color='black' className="elanelana"  style={{marginLeft: '-31px',marginTop: '-15px'}} />
          <p  style={{marginTop: '-15px'}}>285 Frederick St.
Hagerstown</p>
        </div>
    
      </div> 
    
      </div> 
      <div className="footer__social-icons">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebookF />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
      </div>

      </div>

      <div className="footer__copyright">
        <p>&copy; MyLyfeLegacyDB - Copyright 2024</p>
      </div>
    </footer>
  );
}
export default Contact;
