"use client";
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Import Bootstrap JS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import './WhyChooseUs.css'; // Assurez-vous que ce fichier existe avec les styles nécessaires

const handleLoginClick = () => {
  window.location.href = "/crud";
};


const WhyChooseUs = () => {
  return (     
    <div className="why-choose-us-container">
      <h1 className='WHAT'>WHY ?</h1>
      <h2>Why Choose Us</h2>
      <br /><br />
      <section class="section-tarifs" id="tarifs">
      <h3>Create your account effortlessly, with a secure and user-friendly platform designed for everyone.</h3>
      <hr />
<div class="container-tarifs">

    <div class="cartes-tarifs">
    <h4>Reliability</h4>
       
       <span>Data Protection</span>
       <p>✔️ Easy</p>
       <p>✔️ Load Robustness</p>
       <p>✔️ Stable Updates</p>
       {/* <img className="VOLA" src={img2}></img>  */}
       <br /><br /><br />
       <a href="" onClick={handleLoginClick}>Open an account</a>

    </div>

    <div class="cartes-tarifs">
    <h4>Accessibility</h4>
      
      <span>Adapted</span>
      
      <p>✔️ Keyboard navigation</p>
      <p>✔️ High contrast options</p>
      <p>✔️ Compliance accessibility standards</p>
      <br /><br /><br />
      {/* <img className="VOLA" src={img2}></img>  */}
      <a href="" onClick={handleLoginClick}>More info</a>

    </div>


    <div class="cartes-tarifs">
    <h4>Ease of Use</h4>
        <span>Simple</span>
        <p>✔️ Quick to learn</p>
        <p>✔️ Intuitive user interface</p>
        
        <p>✔️ Clear and accessible functions</p>
        {/* <img className="VOLA" src={img2}></img>  */}
        <br /><br /><br />
        <a href="" onClick={handleLoginClick}>More info</a>
    </div>
  


</div>

</section> 
    </div>
  );
}

export default WhyChooseUs;
