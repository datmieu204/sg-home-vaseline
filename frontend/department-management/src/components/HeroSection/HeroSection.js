import React from 'react';
import './HeroSection.css';
import backgroundImage from '../../assets/herosectionimage.png'; 

function HeroSection() {
  return (
    <div className="hero-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div class="author">
            <h1>Department Management System</h1>
            <p>Created by Vaseline Team.</p>
        </div>
    </div>
  );
}

export default HeroSection;
