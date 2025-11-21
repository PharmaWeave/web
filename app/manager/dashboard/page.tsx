import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, ShoppingCart, Clock } from "lucide-react"

export default function ManagerDashboard() {
  const recentActivities = [
    {
      id: 1,
      title: "Novo funcionário cadastrado",
      time: "Há 1 hora",
      type: "success",
    },
    {
      id: 2,
      title: 'Promoção "Desconto 20%" criada',
      time: "Há 3 horas",
      type: "info",
    },
    {
      id: 3,
      title: "15 produtos atualizados",
      time: "Há 5 horas",
      type: "info",
    },
  ]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Painel do Gerente</h1>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <StatCard
            title="Clientes"
            value="3,284"
            subtitle="+125 este mês"
            icon={User}
          />
          <StatCard
            title="Vendas do Mês"
            value="R$ 187K"
            subtitle="+8% vs mês anterior"
            icon={ShoppingCart}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Recent Activities */}
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
