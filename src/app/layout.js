import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

import CarsProvider from "@/components/CarsProvider";
import Search from "@/components/Search";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CarsProvider>
          {/* <Search /> */}
          <section className="w-full h-full min-h-full flex justify-center items-center">
            {children}
          </section>
        </CarsProvider>
      </body>
    </html>
  );
}
