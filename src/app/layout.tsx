import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

import { Roboto } from 'next/font/google';
const roboto = Roboto({ weight: ["300", "500", "900"], subsets: ['latin'], variable: '--roboto' });

export const metadata: Metadata = {
  title: 'LyricLocale - Daily song game',
  description: 'Can you guess the song from its translated lyrics? There\'s a new game every day - good luck!'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.variable}>
        <body>
            {children}
        </body>
        <GoogleAnalytics gaId="G-9JQ0TRRZ1C" />
    </html>
  )
}
