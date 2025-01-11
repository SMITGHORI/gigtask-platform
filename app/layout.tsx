import "@/styles/globals.css"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "GigConnectionHub - Your Gateway to Flexible Work Opportunities",
  description: "Connect with local businesses and event organizers. Find flexible work that fits your schedule.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'