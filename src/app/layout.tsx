import type { Metadata } from 'next'
import './globals.css'

import { Roboto } from 'next/font/google'
const roboto = Roboto({ weight: ["300", "500", "900"], subsets: ['latin'], variable: '--roboto' });

export const metadata: Metadata = {
  title: 'LyricLocale',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.variable}>
        <body>
            <header></header>
            {children}
        </body>
    </html>
  )
}
