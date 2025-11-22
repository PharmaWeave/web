"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building2, TrendingUp, Search, Mail, Edit, CheckCircle2Icon, IdCardIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { StatusType } from "@/@types/status"
import ApiService from "@/services/api"
import URLS from "@/services/urls"
import useAuth from "@/hooks/use-auth"
import normalize from "@/utils/nomalize"
import { formatCPF } from "@/utils/cpf"

interface Manager {
  id: number;
  name: string;
  email: string;
  role: "M";
  register: string;
  salary: number;
  branch: {
    id: number;
    name: string;
  }

  createdAt: Date;
  updatedAt: Date;
  status: StatusType;
}

export default function ManagersPage() {
  const { auth } = useAuth()

  const [managers, setManagers] = useState<Manager[]>([])

  const [search, setSearch] = useState("")

  useEffect(() => {
    ApiService.get(URLS.USER.MANAGER.LIST, {}, auth?.access_token).then((data: { data: Manager[] }) => setManagers(data.data));
  }, []);

  const filteredManagers = useMemo(() => {
    let current = managers;

    if (search.trim().length > 0) {
      const s = normalize(search.toLowerCase());

      current = current.filter((manager) =>
        normalize(manager.name.toLowerCase()).includes(s)
        || normalize(manager.email.toLowerCase()).includes(s)
        || manager.register.includes(s)
        || formatCPF(manager.register).includes(s)
      );
    }

    return current;
  }, [search, managers]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
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

        <Card className="gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar gerentes por nome, email ou CPF..."
                className="pl-10 bg-input border-border"
                onChange={(e) => setSearch(e.currentTarget.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredManagers.map((manager) => (
            <Card key={manager.id} className="gradient-card border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{manager.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-destructive">
                      <CheckCircle2Icon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{manager.branch.name}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IdCardIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{formatCPF(manager.register)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{manager.email}</span>
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
