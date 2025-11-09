import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full text-center py-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
        Itera AI
      </h1>
      <p className="text-lg text-gray-600 mt-2">
        Plan Less. Discover More.
      </p>
    </header>
  );
};

export default Header;