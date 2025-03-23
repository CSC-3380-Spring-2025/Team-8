import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./_global_components/Navbar";
import { Container } from "@mui/material";


export const metadata: Metadata = {
  title: "StudyVerse",
  description: "Generated by create next app",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
