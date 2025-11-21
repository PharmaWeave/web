"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import { RoleEnum } from "@/@types/role"
import useAuth from "@/hooks/use-auth"

export function Sidebar() {
  const { auth } = useAuth();

  const pathname = usePathname()

  const getNavItems = () => {
    const baseItems = [
      {
        href: `/${auth?.role === RoleEnum.ADMIN ? "admin" : auth?.role === RoleEnum.MANAGER ? "manager" : "employee"}/dashboard`,
        label: "Visão Geral",
        icon: LayoutDashboard,
      },
    ]

    if (auth?.role === RoleEnum.ADMIN) {
      return [
        ...baseItems,
        { href: "/admin/units", label: "Unidades", icon: Building2 },
        { href: "/admin/managers", label: "Gerentes", icon: UserCheck }
      ]
    }

    if (auth?.role === RoleEnum.MANAGER) {
      return [
        ...baseItems,
        { href: "/manager/employees", label: "Funcionários", icon: Users },
        { href: "/manager/products", label: "Produtos", icon: Package },
        { href: "/manager/clients", label: "Clientes", icon: User },
        { href: "/manager/promotions", label: "Promoções", icon: Tag },
        { href: "/manager/sales", label: "Vendas", icon: ShoppingCart },
      ]
    }

    if (auth?.role === RoleEnum.EMPLOYEE) {
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
    <div className="flex flex-col h-screen bg-card border-r border-border transition-all duration-300 w-64">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src="/images/pharmaweave-logo.png" alt="PharmaWeave Logo" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <span className="text-sm font-bold">PW</span>
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground truncate">PharmaWeave</h2>
            <p className="text-xs text-muted-foreground capitalize">
              {auth?.role === RoleEnum.ADMIN ? "Administrador" : auth?.role === RoleEnum.MANAGER ? "Gerente" : "Funcionário"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src="/images/pharmaweave-logo.png" alt={`User Avatar`} />
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">User</p>
          </div>
        </div>
      </div>

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
                <span className="truncate">{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 text-muted-foreground hover:text-foreground"
          onClick={() => (window.location.href = "/")}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sair</span>
        </Button>
      </div>
    </div>
  )
}
