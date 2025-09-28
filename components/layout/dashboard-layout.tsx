import type React from "react"
import { Sidebar } from "./sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: "admin" | "manager" | "employee"
  userName: string
}

export function DashboardLayout({ children, userRole, userName }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={userRole} userName={userName} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
