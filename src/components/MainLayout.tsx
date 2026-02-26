import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomBar from './MobileBottomBar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-dark text-white selection:bg-primary selection:text-black">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
};

export default MainLayout;
