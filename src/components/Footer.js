import React from 'react';
import logoImage from '../assets/logo.png';
import copyright from '../assets/icon_copyright.png'

const Footer = () => {
  return (
    <footer className="bg-custom-secondary_color text-white py-2 px-4">
      <div className="container mx-auto flex justify-between">
        <div>
          <p className="text-xl font-bold">Contact us</p>
          <p className="text-base">Tel: 07 77 77 77 77</p>
          <p className="text-base">Mail: lakojary@gmail.com</p>
        </div>
        <div className="flex items-center">
          <img src={logoImage} alt="Website Logo" className="w-5 h-auto" />
          <img src={copyright} alt="Copyright Icon" className="w-6 h-6 ml-2" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
