import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Users, DollarSign, Clock } from "lucide-react"

export default function EmployeeDashboard() {
  const recentActivities = [
    {
      id: 1,
      title: "Venda #1847 registrada",
      time: "Há 15 min",
      type: "success",
    },
    {
      id: 2,
      title: "Cliente Maria Santos cadastrada",
      time: "Há 1 hora",
      type: "info",
    },
    {
      id: 3,
      title: "Estoque de Dipirona atualizado",
      time: "Há 2 horas",
      type: "info",
    },
  ]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Painel do Funcionário</h1>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Vendas Hoje"
            value="23"
            icon={ShoppingCart}
          />
          <StatCard
            title="Clientes Atendidos"
            value="45"
            icon={Users}
          />
          <StatCard
            title="Faturamento Hoje"
            value="R$ 3,247"
            icon={DollarSign}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${activity.type === "success"
                      ? "bg-green-500"
                      : activity.type === "info"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                      }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
