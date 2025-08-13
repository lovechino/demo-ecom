import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { CartProvider } from "./components/CartContext";
import { Suspense } from "react";
import PerformanceMonitor from "./components/PerformanceMonitor";

export const metadata: Metadata = {
  title: {
    default: "Demo E-commerce - Mua sắm trực tuyến chất lượng cao",
    template: "%s | Demo E-commerce"
  },
  description: "Khám phá bộ sưu tập sản phẩm đa dạng với chất lượng cao, giá cả hợp lý. Mua sắm trực tuyến an toàn, giao hàng nhanh chóng.",
  keywords: ["e-commerce", "mua sắm trực tuyến", "sản phẩm chất lượng", "giao hàng nhanh", "thanh toán an toàn"],
  authors: [{ name: "Demo E-commerce Team" }],
  creator: "Demo E-commerce",
  publisher: "Demo E-commerce",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://demo-ecom.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://demo-ecom.vercel.app',
    siteName: 'Demo E-commerce',
    title: 'Demo E-commerce - Mua sắm trực tuyến chất lượng cao',
    description: 'Khám phá bộ sưu tập sản phẩm đa dạng với chất lượng cao, giá cả hợp lý. Mua sắm trực tuyến an toàn, giao hàng nhanh chóng.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Demo E-commerce - Mua sắm trực tuyến',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Demo E-commerce - Mua sắm trực tuyến chất lượng cao',
    description: 'Khám phá bộ sưu tập sản phẩm đa dạng với chất lượng cao, giá cả hợp lý.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/favicon.ico" as="image" />
        <link rel="preload" href="/apple-touch-icon.png" as="image" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Performance optimization meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Demo E-commerce",
              "url": "https://demo-ecom.vercel.app",
              "logo": "https://demo-ecom.vercel.app/logo.png",
              "description": "Cửa hàng trực tuyến cung cấp sản phẩm chất lượng cao",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "VN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "Vietnamese"
              }
            })
          }}
        />
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning={true}
      >
        <CartProvider>
          <Suspense fallback={
            <div className="h-16 border-b bg-white/80 backdrop-blur animate-pulse">
              <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          }>
            <Navbar />
          </Suspense>
          {children}
        </CartProvider>
        
        {/* Performance Monitor - Only in development */}
        <PerformanceMonitor />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Service Worker Registration
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
              
              // Performance monitoring
              if ('performance' in window) {
                window.addEventListener('load', () => {
                  const perfData = performance.getEntriesByType('navigation')[0];
                  if (perfData) {
                    console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                  }
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
