"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard } from "@/components/ui/stat-card"
import useAuth from "@/hooks/use-auth"
import ApiService, { ApiResponse } from "@/services/api"
import URLS from "@/services/urls"
import { Building2, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"

interface AdminMetrics {
  branch_count: number;
  month_revenue: number;
  growth_percentage: number;
}

export default function AdminDashboard() {
  const { auth } = useAuth()

  const [metrics, setMetrics] = useState<AdminMetrics>({
    branch_count: 0,
    month_revenue: 0,
    growth_percentage: 0
  })

  useEffect(() => {
    ApiService.get(URLS.METRICS.RETRIEVE, {}, auth?.access_token)
      .then((data: ApiResponse<AdminMetrics>) => {
        setMetrics(data.data)
      })
  }, [])

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Painel do Administrador</h1>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <StatCard
            title="Unidades Totais"
            value={metrics.branch_count}
            icon={Building2}
          />
          <StatCard
            title="Receita Mensal Total"
            value={"R$ " + (metrics.month_revenue / 100).toFixed(2)}
            subtitle={(metrics.growth_percentage > 0 ? "+" : "") + metrics.growth_percentage + "% vs mês anterior"}
            icon={DollarSign}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
