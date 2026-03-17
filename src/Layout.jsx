import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      {/* You can add a Navbar or Header here */}
      <main>{children}</main>
      {/* You can add a Footer here */}
    </div>
  );
};

export default Layout;