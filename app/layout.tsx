import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono, Albert_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

// Modern, highly readable font for body text and UI
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

// Latest modern display font - excellent for headings and large text
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-plus-jakarta',
})

// Modern monospace font for code, technical elements, and data
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-jetbrains',
})

// Clean, modern alternative sans-serif for variety
const albertSans = Albert_Sans({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-albert',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://salespilots.io'),
  title: {
    default: 'SalesPilots - AI-Powered Instagram Business Automation Platform',
    template: '%s | SalesPilots'
  },
  description: 'Transform your Instagram business with AI-powered automation that handles customer interactions, verifies payments, and manages orders in Indian languages. Trusted by 10,000+ businesses.',
  keywords: [
    'Instagram automation',
    'AI chatbot India',
    'payment verification',
    'order processing automation',
    'business automation',
    'Instagram DM automation',
    'WhatsApp Business API',
    'multi-language support',
    'Manglish',
    'Hindi automation',
    'Tamil automation',
    'Indian business automation',
    'social media automation',
    'customer service automation',
    'e-commerce automation'
  ],
  authors: [{ name: 'SalesPilots Technologies Pvt. Ltd.' }],
  creator: 'SalesPilots Technologies Pvt. Ltd.',
  publisher: 'SalesPilots Technologies Pvt. Ltd.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://salespilots.io',
    siteName: 'SalesPilots',
    title: 'SalesPilots - AI-Powered Instagram Business Automation',
    description: 'Automate your Instagram business with AI that speaks your customers\' language. Handle DMs, verify payments, and process orders 24/7 in Hindi, Tamil, Manglish & more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SalesPilots - AI Instagram Automation Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@salespilots_io',
    creator: '@salespilots_io',
    title: 'SalesPilots - AI Instagram Automation for Indian Businesses',
    description: 'Replace expensive employees with AI automation. Handle customer interactions, verify payments & process orders in local languages.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://salespilots.io',
    languages: {
      'en-IN': 'https://salespilots.io',
      'hi-IN': 'https://salespilots.io/hi',
      'ta-IN': 'https://salespilots.io/ta',
    },
  },
  category: 'technology',
  classification: 'business automation',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SalesPilots',
    'application-name': 'SalesPilots',
    'msapplication-TileColor': '#0f172a',
    'theme-color': '#0f172a',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} ${albertSans.variable} ${inter.className}`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(15, 23, 42, 0.95)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(20px)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
