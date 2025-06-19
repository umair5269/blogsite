import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  const { pathname } = useLocation();

  // Routes that should NOT show header/footer
  const hideLayoutRoutes = ['/login', '/signup'];

  const shouldHideLayout = hideLayoutRoutes.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!shouldHideLayout && <Header />}
      <main className="flex-grow">{children}</main>
      {!shouldHideLayout && <Footer />}
    </div>
  );
}

export default Layout;
