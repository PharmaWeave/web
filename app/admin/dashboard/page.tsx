import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, DollarSign, Clock } from "lucide-react"

export default function AdminDashboard() {
  const recentActivities = [
    {
      id: 1,
      title: 'Nova unidade "Farmácia Centro" cadastrada',
      time: "Há 2 horas",
      type: "success",
    },
    {
      id: 2,
      title: "Unidade São Paulo - Norte ativada",
      time: "Há 4 horas",
      type: "info",
    },
    {
      id: 3,
      title: "Novo gerente atribuído à unidade Norte",
      time: "Há 6 horas",
      type: "info",
    },
  ]

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
            value="23"
            subtitle="+2 este mês"
            icon={Building2}
          />
          <StatCard
            title="Receita da Rede"
            value="R$ 2.4M"
            subtitle="+15% vs mês anterior"
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
