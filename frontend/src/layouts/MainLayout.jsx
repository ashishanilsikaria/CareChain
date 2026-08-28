import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
