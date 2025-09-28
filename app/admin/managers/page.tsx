import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/ui/stat-card"
import { UserCheck, Building2, TrendingUp, Search, Mail, Phone, Edit, Trash2 } from "lucide-react"

export default function ManagersPage() {
  const managers = [
    {
      id: 1,
      name: "Carlos Silva",
      unit: "Farmácia Centro",
      email: "carlos@pharmaweave.com",
      phone: "123.456.789-01",
      startDate: "14/01/2023",
    },
    {
      id: 2,
      name: "Ana Santos",
      unit: "Farmácia Norte",
      email: "ana@pharmaweave.com",
      phone: "234.567.890-12",
      startDate: "09/03/2023",
    },
    {
      id: 3,
      name: "João Costa",
      unit: "Farmácia Sul",
      email: "joao@pharmaweave.com",
      phone: "345.678.901-23",
      startDate: "19/02/2023",
    },
    {
      id: 4,
      name: "Maria Oliveira",
      unit: "Farmácia Oeste",
      email: "maria@pharmaweave.com",
      phone: "456.789.012-34",
      startDate: "04/11/2022",
    },
  ]

  return (
    <DashboardLayout userRole="admin" userName="Administrador">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gerentes</h1>
            <p className="text-muted-foreground">Gerencie os gerentes das unidades</p>
          </div>
          <Button className="gradient-primary text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Promover Funcionário
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total de Gerentes" value="4" icon={UserCheck} />
          <StatCard title="Gerentes" value="4" icon={UserCheck} />
          <StatCard title="Unidades Gerenciadas" value="4" icon={Building2} />
        </div>

        {/* Search */}
        <Card className="gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar gerentes..." className="pl-10 bg-input border-border" />
            </div>
          </CardContent>
        </Card>

        {/* Managers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {managers.map((manager) => (
            <Card key={manager.id} className="gradient-card border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{manager.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{manager.unit}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{manager.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{manager.phone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Início:</span>
                    <span className="text-foreground">{manager.startDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
