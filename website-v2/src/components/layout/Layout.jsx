import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';

/**
 * Top-level layout wrapper that provides the persistent navbar and footer.
 * This component mirrors the existing layout structure in App.jsx to avoid
 * any visual or behavioral changes while centralizing the shell logic.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Page content to render between navbar and footer.
 */
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;

