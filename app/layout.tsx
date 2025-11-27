import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

import AuthContextProvider from "@/contexts/auth-context"
import AuthGuard from "@/components/auth/auth-guard"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "PharmaWeave",
  description: "PharmaWeave"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Toaster />
        <Suspense fallback={<AuthGuard />}>
          <AuthContextProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </AuthContextProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
