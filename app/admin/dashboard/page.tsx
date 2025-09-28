import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, DollarSign, AlertTriangle, Clock, CheckCircle } from "lucide-react"

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

  const alerts = [
    {
      id: 1,
      title: "23 produtos com estoque baixo",
      subtitle: "Requer atenção",
      type: "warning",
    },
    {
      id: 2,
      title: "Promoção termina em 2 dias",
      subtitle: "Desconto 15% Vitaminas",
      type: "info",
    },
    {
      id: 3,
      title: "87% da meta mensal atingida",
      subtitle: "Ótimo progresso!",
      type: "success",
    },
  ]

  return (
    <DashboardLayout userRole="admin" userName="Administrador">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Painel do Administrador</h1>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Unidades Totais"
            value="23"
            subtitle="+2 este mês"
            icon={Building2}
            trend={{ value: "8.7%", isPositive: true }}
          />
          <StatCard
            title="Gerentes Ativos"
            value="18"
            subtitle="+1 este mês"
            icon={Users}
            trend={{ value: "5.6%", isPositive: true }}
          />
          <StatCard
            title="Funcionários Totais"
            value="156"
            subtitle="+12 este mês"
            icon={Users}
            trend={{ value: "8.3%", isPositive: true }}
          />
          <StatCard
            title="Receita da Rede"
            value="R$ 2.4M"
            subtitle="+15% vs mês anterior"
            icon={DollarSign}
            trend={{ value: "15.2%", isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "success"
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

          {/* Alerts and Notifications */}
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Alertas e Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      alert.type === "warning"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : alert.type === "success"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-blue-500/20 text-blue-500"
                    }`}
                  >
                    {alert.type === "warning" ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : alert.type === "success" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.subtitle}</p>
                  </div>
                  <Badge
                    variant={
                      alert.type === "warning" ? "destructive" : alert.type === "success" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {alert.type === "warning" ? "Atenção" : alert.type === "success" ? "Sucesso" : "Info"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
