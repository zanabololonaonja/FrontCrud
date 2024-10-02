"use client";
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Import Bootstrap JS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import './WhyChooseUs.css'; // Assurez-vous que ce fichier existe avec les styles nécessaires

const WhyChooseUs = () => {
  return (     
    <div className="why-choose-us-container">
      <h1 className='WHAT'>WHY ?</h1>
      <h2>Why Choose Us</h2>
      <br /><br />
      {/* Bootstrap Carousel */}
      <div id="myCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-wrap="true">
      
        <div className="icon-top-left-carousel">
          {/* <FontAwesomeIcon icon={faCoffee} size="2x" /> */}
        </div>

        {/* Indicators */}
        <ol className="carousel-indicators">
          <li data-bs-target="#myCarousel" data-bs-slide-to="0" className="active"></li>
          <li data-bs-target="#myCarousel" data-bs-slide-to="1"></li>
          <li data-bs-target="#myCarousel" data-bs-slide-to="2"></li>
        </ol>

        {/* Wrapper for slides */}
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://st.depositphotos.com/22162388/53338/i/600/depositphotos_533388100-stock-photo-cyber-security-data-protection-information.jpg" alt="Chania" className="d-block w-100" />
            <div className="carousel-caption d-none d-md-block">
              <h3>Reliability</h3>
              <p>Our platform offers maximum security for your data with regular backups and protection against unauthorized access.</p>
            </div>
          </div>

          <div className="carousel-item">
            <img src="https://st4.depositphotos.com/1005233/23296/i/600/depositphotos_232960476-stock-photo-view-businessman-holding-devices-medical.jpg" alt="Chicago" className="d-block w-100" />
            <div className="carousel-caption d-none d-md-block">
              <h3>Ease of Use</h3>
              <p>We designed our interface to be intuitive and easy to use, even for less experienced users.</p>
            </div>
          </div>
           <div className="carousel-item">
            <img src="  https://st3.depositphotos.com/7865540/13629/i/600/depositphotos_136297834-stock-photo-technology-accessible-concept.jpg
       " alt="New York" className="d-block w-10" />
            <div className="carousel-caption d-none d-md-block">
              <h3>Accessibility</h3> 
              <p>Access your information from anywhere and on any device, whether it's a computer, tablet, or smartphone.</p>
            </div>
          </div>
        </div>

        {/* Left and right controls */}
        <a className="carousel-control-prev" href="#myCarousel" role="button" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </a>
        <a className="carousel-control-next" href="#myCarousel" role="button" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </a>
      </div>
    </div>
  );
}

export default WhyChooseUs;
