import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pet Sitter",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.cdnfonts.com/css/satoshi" rel="stylesheet" />
      </head>
      <body className={`font-satoshi bg-white ${inter.className}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
