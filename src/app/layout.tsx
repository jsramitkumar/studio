import type {Metadata} from 'next';
// import { GeistSans } from 'geist/font/sans'; // Removed due to missing dependency
// import { GeistMono } from 'geist/font/mono'; // Removed due to missing dependency
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'ServerPulse',
  description: 'Monitor your server vitals in real-time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" > {/* Removed Geist font variables */}
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
