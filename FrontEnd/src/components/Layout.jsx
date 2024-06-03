import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="pt-16">{children}</main> {/* Adjust 'pt-16' to match the height of your navbar */}
    </div>
  );
};

export default Layout;
