import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Configure o sistema</p>
        </div>

        {/* Development Notice */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Módulo em desenvolvimento...</CardTitle>
            <CardDescription>Esta seção está sendo desenvolvida e estará disponível em breve.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <p>Configurações do sistema em desenvolvimento</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
