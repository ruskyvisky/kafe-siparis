"use client"
import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import "./globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css'
import Sidebar from "./components/Sidebar/sidebar";
import { ToastContainer } from 'react-toastify';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); 
  const hideSidebar = pathname.startsWith("/customer-menu") || pathname === "/login";

  return (
    <html lang="en">
      <body>
        {!hideSidebar && <Sidebar />}
        <ToastContainer />
        <div className={` ${!hideSidebar ? "md:ml-64" : ""}`}>
          {children}
        </div>
      </body>
    </html>
  );
}
