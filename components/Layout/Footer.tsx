
import React from 'react';
import { APP_NAME } from '../../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-6 text-center">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-1">Thiết kế chiếu sáng thông minh, dễ dàng và hiệu quả.</p>
      </div>
    </footer>
  );
};

export default Footer;
