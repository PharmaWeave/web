import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, Users, DollarSign, Clock, AlertTriangle, CheckCircle } from "lucide-react"

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
    <DashboardLayout userRole="employee" userName="Usuário">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Painel do Funcionário</h1>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Vendas Hoje"
            value="23"
            subtitle="Meta: 30 vendas"
            icon={ShoppingCart}
            trend={{ value: "77%", isPositive: true }}
          />
          <StatCard
            title="Produtos em Estoque"
            value="1,847"
            subtitle="23 com estoque baixo"
            icon={Package}
            trend={{ value: "2", isPositive: false }}
          />
          <StatCard
            title="Clientes Atendidos"
            value="45"
            subtitle="Hoje"
            icon={Users}
            trend={{ value: "12%", isPositive: true }}
          />
          <StatCard
            title="Faturamento Hoje"
            value="R$ 3,247"
            subtitle="Meta: R$ 4,000"
            icon={DollarSign}
            trend={{ value: "81%", isPositive: true }}
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
