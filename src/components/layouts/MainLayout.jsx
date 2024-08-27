import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import React from "react";

function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
