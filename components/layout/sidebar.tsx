"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  UserCheck,
  Tag,
  ShoppingCart,
  Settings,
  LogOut,
  User,
} from "lucide-react"

interface SidebarProps {
  userRole: "admin" | "manager" | "employee"
  userName: string
}

export function Sidebar({ userRole, userName }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const getNavItems = () => {
    const baseItems = [
      {
        href: `/${userRole === "admin" ? "admin" : userRole === "manager" ? "manager" : "employee"}/dashboard`,
        label: "Visão Geral",
        icon: LayoutDashboard,
      },
    ]

    if (userRole === "admin") {
      return [
        ...baseItems,
        { href: "/admin/units", label: "Unidades", icon: Building2 },
        { href: "/admin/managers", label: "Gerentes", icon: UserCheck },
        { href: "/admin/settings", label: "Configurações", icon: Settings },
      ]
    }

    if (userRole === "manager") {
      return [
        ...baseItems,
        { href: "/manager/employees", label: "Funcionários", icon: Users },
        { href: "/manager/products", label: "Produtos", icon: Package },
        { href: "/manager/clients", label: "Clientes", icon: User },
        { href: "/manager/promotions", label: "Promoções", icon: Tag },
        { href: "/manager/sales", label: "Vendas", icon: ShoppingCart },
      ]
    }

    if (userRole === "employee") {
      return [
        ...baseItems,
        { href: "/employee/products", label: "Produtos", icon: Package },
        { href: "/employee/clients", label: "Clientes", icon: User },
        { href: "/employee/sales", label: "Vendas", icon: ShoppingCart },
      ]
    }

    return baseItems
  }

  const navItems = getNavItems()

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src="/images/pharmaweave-logo.png" alt="PharmaWeave Logo" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <span className="text-sm font-bold">PW</span>
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground truncate">PharmaWeave</h2>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src="/images/pharmaweave-logo.png" alt={`${userName} Avatar`} />
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              <Badge variant="secondary" className="text-xs">
                Online
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isActive && "bg-primary text-primary-foreground",
                  !isActive && "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 text-muted-foreground hover:text-foreground"
          onClick={() => (window.location.href = "/")}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  )
}
