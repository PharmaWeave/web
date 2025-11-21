"use client"

import type React from "react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/ui/stat-card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plus, Search, Mail, Edit, Power } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { StatusEnum, StatusType } from "@/@types/status"
import { RoleType } from "@/@types/role"
import ApiService from "@/services/api"
import URLS from "@/services/urls"
import useAuth from "@/hooks/use-auth"
import { formatCPF } from "@/utils/cpf"
import normalize from "@/utils/nomalize"

interface Employee {
  id: number;
  name: string;
  email: string;
  role: RoleType;
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

export default function EmployeesPage() {
  const { auth } = useAuth()

  const [showActiveOnly, setShowActiveOnly] = useState(true)
  const [search, setSearch] = useState("")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    salary: "",
    role: "",
  })

  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    ApiService.get(URLS.USER.EMPLOYEE.LIST, {}, auth?.access_token).then((data: { data: Employee[] }) => setEmployees(data.data));
  }, []);

  const isEmployeeActive = (employee: Employee) => {
    return employee.status === StatusEnum.ACTIVE;
  }

  const filteredEmployees = useMemo(() => {
    let current = employees;

    if (showActiveOnly) {
      current = current.filter((employee) => isEmployeeActive(employee));
    }

    if (search.trim().length > 0) {
      const s = normalize(search.toLowerCase());

      current = current.filter((employee) =>
        normalize(employee.name.toLowerCase()).includes(s)
        || normalize(employee.email.toLowerCase()).includes(s)
      );
    }

    return current;
  }, [showActiveOnly, search, employees]);

  const handleToggleStatus = (employeeId: number) => {

  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Funcionários</h1>
            <p className="text-muted-foreground">Gerencie os funcionários da farmácia</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white">
                <Plus className="w-4 h-4 mr-2" />
                Novo Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Novo Funcionário</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Nome completo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={formatCPF(formData.cpf)}
                      maxLength={14}
                      onChange={(e) => handleInputChange("cpf", e.target.value)}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="funcionario@pharmaweave.com"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salário</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={formData.salary}
                      onChange={(e) => handleInputChange("salary", e.target.value)}
                      placeholder="R$ 0,00"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="gradient-primary text-white">
                    Cadastrar Funcionário
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Total de Funcionários" value={employees.length} icon={Users} />
          <StatCard title="Funcionários Ativos" value={employees.filter(emp => isEmployeeActive(emp)).length} icon={Users} />
        </div>

        <Card className="gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar funcionários por nome ou email..."
                  className="pl-10 bg-input border-border"
                  onChange={(e) => setSearch(e.currentTarget.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Mostrar apenas ativos</span>
                <div
                  className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${showActiveOnly ? "bg-primary" : "bg-gray-300"
                    }`}
                  onClick={() => setShowActiveOnly(!showActiveOnly)}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${showActiveOnly ? "right-1" : "left-1"
                      }`}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card
              key={employee.id}
              className={`gradient-card border-border/50 ${employee.status === StatusEnum.INACTIVE ? "opacity-60" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-8 h-8 p-0"
                      onClick={() => handleToggleStatus(employee.id)}
                    >
                      <Power
                        className={`w-4 h-4 ${employee.status === StatusEnum.ACTIVE ? "text-red-500" : "text-green-500"}`}
                      />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{employee.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">CPF:</span>
                    <span className="text-sm font-medium text-foreground">{formatCPF(employee.register)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Salário:</span>
                    <span className="text-sm font-medium text-green-500">R$ {(employee.salary / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant={employee.status === StatusEnum.ACTIVE ? "default" : "secondary"} className="text-xs">
                      {employee.status === StatusEnum.ACTIVE ? "Ativo" : "Inativo"}
                    </Badge>
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
