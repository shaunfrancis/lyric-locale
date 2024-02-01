import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

import { Roboto } from 'next/font/google';
const roboto = Roboto({ weight: ["300", "500", "900"], subsets: ['latin'], variable: '--roboto' });

const desc = 'Can you guess the song from its translated lyrics? There\'s a new game every day - good luck!';
export const metadata: Metadata = {
  title: 'LyricLocale - Daily song game',
  description: desc,
  metadataBase: new URL('https://lyriclocale.tennessine.co.uk'),
  twitter: {
    card: 'summary_large_image',
    title: 'LyricLocale - Daily song game',
    description: desc,
    site: '@TennessineWeb',
    images: ['https://lyriclocale.tennessine.co.uk/summary-large-image.png']
  },
  openGraph: {
    url: 'https://lyriclocale.tennessine.co.uk',
    title: 'LyricLocale - Daily song game',
    description: desc,
    images: ['https://lyriclocale.tennessine.co.uk/summary-large-image.png']
  }
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
