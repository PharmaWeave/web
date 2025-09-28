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
import { useState } from "react"

export default function EmployeesPage() {
  const [showActiveOnly, setShowActiveOnly] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    salary: "",
    role: "",
  })

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Pedro Santos",
      role: "Farmacêutico",
      email: "pedro@pharmaweave.com",
      cpf: "123.456.789-01",
      salary: "R$ 4.500",
      status: "active",
    },
    {
      id: 2,
      name: "Julia Oliveira",
      role: "Atendente",
      email: "julia@pharmaweave.com",
      cpf: "234.567.890-12",
      salary: "R$ 2.200",
      status: "active",
    },
    {
      id: 3,
      name: "Lucas Costa",
      role: "Estoquista",
      email: "lucas@pharmaweave.com",
      cpf: "345.678.901-23",
      salary: "R$ 2.000",
      status: "active",
    },
    {
      id: 4,
      name: "Ricardo Alves",
      role: "Farmacêutico",
      email: "ricardo@pharmaweave.com",
      cpf: "567.890.123-45",
      salary: "R$ 4.500",
      status: "active",
    },
    {
      id: 5,
      name: "Ana Costa",
      role: "Atendente",
      email: "ana@pharmaweave.com",
      cpf: "678.901.234-56",
      salary: "R$ 2.200",
      status: "inactive",
    },
  ])

  const filteredEmployees = showActiveOnly ? employees.filter((emp) => emp.status === "active") : employees

  const handleToggleStatus = (employeeId: number) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === employeeId
          ? { ...employee, status: employee.status === "active" ? "inactive" : "active" }
          : employee,
      ),
    )
    console.log(`[v0] Funcionário ${employeeId} status alterado`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Novo funcionário:", formData)
    setIsDialogOpen(false)
    setFormData({ name: "", cpf: "", email: "", salary: "", role: "" })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardLayout userRole="manager" userName="Gerente">
      <div className="p-6 space-y-6">
        {/* Header */}
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
                      value={formData.cpf}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salário</Label>
                    <Input
                      id="salary"
                      value={formData.salary}
                      onChange={(e) => handleInputChange("salary", e.target.value)}
                      placeholder="R$ 0,00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Cargo</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Farmacêutico">Farmacêutico</SelectItem>
                        <SelectItem value="Atendente">Atendente</SelectItem>
                        <SelectItem value="Estoquista">Estoquista</SelectItem>
                        <SelectItem value="Gerente">Gerente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Total de Funcionários" value="5" icon={Users} />
          <StatCard title="Funcionários Ativos" value="4" icon={Users} />
        </div>

        {/* Search and Filters */}
        <Card className="gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar funcionários por nome, email, CPF ou cargo..."
                  className="pl-10 bg-input border-border"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Mostrar apenas ativos</span>
                <div
                  className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${
                    showActiveOnly ? "bg-primary" : "bg-gray-300"
                  }`}
                  onClick={() => setShowActiveOnly(!showActiveOnly)}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                      showActiveOnly ? "right-1" : "left-1"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employees Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card
              key={employee.id}
              className={`gradient-card border-border/50 ${employee.status === "inactive" ? "opacity-60" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <Badge
                      variant={
                        employee.role === "Farmacêutico"
                          ? "default"
                          : employee.role === "Atendente"
                            ? "secondary"
                            : "outline"
                      }
                      className="mt-1"
                    >
                      {employee.role}
                    </Badge>
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
                        className={`w-4 h-4 ${employee.status === "active" ? "text-red-500" : "text-green-500"}`}
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
                    <span className="text-sm font-medium text-foreground">{employee.cpf}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Salário:</span>
                    <span className="text-sm font-medium text-green-500">{employee.salary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant={employee.status === "active" ? "default" : "secondary"} className="text-xs">
                      {employee.status === "active" ? "Ativo" : "Inativo"}
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
