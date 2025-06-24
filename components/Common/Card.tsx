
import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  footerContent?: ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '', bodyClassName = '', footerContent }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl overflow-hidden ${className}`}>
      {title && (
        <div className={`px-6 py-4 border-b border-gray-200 ${titleClassName}`}>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
      {footerContent && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default Card;
