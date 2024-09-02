import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import React from "react";

function MainLayout({ children, session }) {
  return (
    <div>
      <Navbar session={session} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
