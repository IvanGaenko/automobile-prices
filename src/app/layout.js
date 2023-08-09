import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

import CarsProvider from "@/components/CarsProvider";

export const metadata = {
  title: "Automobile Prices",
  description: "Rankings based on data scraped from websites.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CarsProvider>{children}</CarsProvider>
      </body>
    </html>
  );
}
