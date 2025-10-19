import React, { useState } from 'react';
import { FiPhone, FiMail } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';

const ContactToolbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const contactItems = [
    {
      id: 'phone',
      icon: <FiPhone className="w-4 h-4" />,
      label: '07006268722',
      href: 'tel:+9007006268722',
      color: 'text-yellow-400',
      bgColor: 'hover:bg-yellow-400/10'
    },
    {
      id: 'whatsapp',
      icon: <FaWhatsapp className="w-4 h-4" />,
      label: 'WhatsApp',
      href: 'https://wa.me/9007006268722',
      color: 'text-green-400',
      bgColor: 'hover:bg-green-400/10'
    },
    {
      id: 'messenger',
      icon: <FaFacebookMessenger className="w-4 h-4" />,
      label: 'Messenger',
      href: 'https://m.me/yourpage',
      color: 'text-blue-400',
      bgColor: 'hover:bg-blue-400/10'
    },
    {
      id: 'email',
      icon: <FiMail className="w-4 h-4" />,
      label: 'Contact Us',
      href: 'mailto:info@grader-marketplace.com',
      color: 'text-yellow-400',
      bgColor: 'hover:bg-yellow-400/10'
    }
  ];

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block fixed right-0 top-1/2 transform -translate-y-1/2 z-40">
        <div className="bg-gray-900/95 backdrop-blur-sm border-l border-gray-700 shadow-lg rounded-l-lg overflow-hidden">
          <div className="flex flex-col">
            {contactItems.map((item, index) => (
              <a
                key={item.id}
                href={item.href}
                target={item.id === 'whatsapp' || item.id === 'messenger' ? '_blank' : undefined}
                rel={item.id === 'whatsapp' || item.id === 'messenger' ? 'noopener noreferrer' : undefined}
                className={`
                  group flex items-center px-3 py-2 transition-all duration-300 
                  ${item.bgColor} hover:shadow-md hover:scale-105
                  ${index === 0 ? 'rounded-tl-lg' : ''}
                  ${index === contactItems.length - 1 ? 'rounded-bl-lg' : ''}
                  border-b border-gray-700 last:border-b-0
                `}
              >
                <div className={`${item.color} group-hover:scale-110 transition-transform duration-200`}>
                  {item.icon}
                </div>
                <div className="ml-2 min-w-0">
                  <div className="text-white text-xs font-medium group-hover:text-yellow-300 transition-colors">
                    {item.label}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden fixed right-2 top-1/2 transform -translate-y-1/2 z-40">
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg overflow-hidden">
          <div className="flex flex-col">
            {contactItems.map((item, index) => (
              <a
                key={item.id}
                href={item.href}
                target={item.id === 'whatsapp' || item.id === 'messenger' ? '_blank' : undefined}
                rel={item.id === 'whatsapp' || item.id === 'messenger' ? 'noopener noreferrer' : undefined}
                className={`
                  group flex items-center justify-center p-2 transition-all duration-300 
                  ${item.bgColor} hover:shadow-md active:scale-95
                  ${index === 0 ? 'rounded-t-lg' : ''}
                  ${index === contactItems.length - 1 ? 'rounded-b-lg' : ''}
                  border-b border-gray-700 last:border-b-0
                `}
              >
                <div className={`${item.color} group-active:scale-110 transition-transform duration-200`}>
                  {item.icon}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip for Mobile */}
      <div className="lg:hidden fixed right-20 top-1/2 transform -translate-y-1/2 z-30">
        <div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg opacity-0 pointer-events-none transition-opacity duration-300" id="mobile-tooltip">
          <div className="text-sm font-medium" id="tooltip-text">Contact Us</div>
          <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
            <div className="w-0 h-0 border-l-8 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactToolbar;
