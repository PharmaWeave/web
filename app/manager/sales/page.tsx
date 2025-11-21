import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/ui/stat-card"
import { ShoppingCart, Plus, DollarSign, TrendingUp, Users } from "lucide-react"

export default function SalesPage() {
  const recentSales = [
    {
      id: 1847,
      client: "Maria Santos",
      employee: "João Funcionário",
      items: 3,
      total: "R$ 45.80",
      time: "14:30",
      status: "completed",
    },
    {
      id: 1846,
      client: "João Silva",
      employee: "Ana Funcionária",
      items: 1,
      total: "R$ 12.90",
      time: "14:15",
      status: "completed",
    },
    {
      id: 1845,
      client: "Pedro Oliveira",
      employee: "Carlos Funcionário",
      items: 2,
      total: "R$ 28.40",
      time: "13:45",
      status: "completed",
    },
    {
      id: 1844,
      client: "Ana Costa",
      employee: "João Funcionário",
      items: 5,
      total: "R$ 89.50",
      time: "13:20",
      status: "completed",
    },
    {
      id: 1843,
      client: "Roberto Lima",
      employee: "Ana Funcionária",
      items: 2,
      total: "R$ 67.30",
      time: "12:55",
      status: "completed",
    },
  ]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
            <p className="text-muted-foreground">Gerencie as vendas da farmácia</p>
          </div>
          <Button className="gradient-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nova Venda
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Vendas Hoje"
            value="47"
            subtitle="Meta: 60 vendas"
            icon={ShoppingCart}
            trend={{ value: "78%", isPositive: true }}
          />
          <StatCard
            title="Faturamento Hoje"
            value="R$ 6,847"
            subtitle="Meta: R$ 8,000"
            icon={DollarSign}
            trend={{ value: "86%", isPositive: true }}
          />
          <StatCard
            title="Ticket Médio"
            value="R$ 146"
            subtitle="+8% vs ontem"
            icon={TrendingUp}
            trend={{ value: "8%", isPositive: true }}
          />
          <StatCard
            title="Funcionários Ativos"
            value="8"
            subtitle="Vendendo hoje"
            icon={Users}
            trend={{ value: "100%", isPositive: true }}
          />
        </div>

        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Vendas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">ID</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Funcionário</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Itens</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Total</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Horário</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale) => (
                    <tr key={sale.id} className="border-b border-border/50 hover:bg-secondary/50">
                      <td className="p-3 text-sm font-medium text-foreground">#{sale.id}</td>
                      <td className="p-3 text-sm text-foreground">{sale.client}</td>
                      <td className="p-3 text-sm text-muted-foreground">{sale.employee}</td>
                      <td className="p-3 text-sm text-foreground">{sale.items}</td>
                      <td className="p-3 text-sm font-medium text-green-500">{sale.total}</td>
                      <td className="p-3 text-sm text-foreground">{sale.time}</td>
                      <td className="p-3">
                        <Badge variant="default" className="text-xs">
                          Concluída
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
