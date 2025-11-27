"use client"

import { EmployeeMetrics } from "@/@types/metrics"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard } from "@/components/ui/stat-card"
import useAuth from "@/hooks/use-auth"
import ApiService, { ApiResponse } from "@/services/api"
import URLS from "@/services/urls"
import { DollarSign, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"

export default function EmployeeDashboard() {
  const { auth } = useAuth()

  const [metrics, setMetrics] = useState<EmployeeMetrics>({
    today_sales: 0,
    today_revenue: 0,
    growth_percentage: 0
  })

  useEffect(() => {
    ApiService.get(URLS.METRICS.RETRIEVE, {}, auth?.access_token)
      .then((data: ApiResponse<EmployeeMetrics>) => {
        setMetrics(data.data)
      })
  }, [])

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Painel do Funcionário</h1>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <StatCard
            title="Vendas Hoje"
            value={metrics.today_sales}
            icon={ShoppingCart}
          />
          <StatCard
            title="Faturamento Pessoal (Hoje)"
            value={"R$ " + (metrics.today_revenue / 100).toFixed(2)}
            subtitle={(metrics.growth_percentage > 0 ? "+" : "") + metrics.growth_percentage + "% vs ontem"}
            icon={DollarSign}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
