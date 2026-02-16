import type { Metadata } from "next";
import { Poppins, Rammetto_One } from "next/font/google";
import "./globals.css";


const poppins = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const ram = Rammetto_One({
  variable: "--font-ram-sans",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Shortly",
  description: "Start shortening your links and collect data seamlessly. Create a new link now to simplify sharing and gain valueable insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${ram.variable} antialiased flex w-full justify-center font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
