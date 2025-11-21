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
import { Textarea } from "@/components/ui/textarea"
import { Building2, Users, DollarSign, Plus, Search, MapPin, Edit, Power } from "lucide-react"
import { useState } from "react"

export default function UnitsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [showActiveOnly, setShowActiveOnly] = useState(true)
  const [editingUnit, setEditingUnit] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    address: "",
    number: "",
    description: "",
  })

  const [units, setUnits] = useState([
    {
      id: 1,
      name: "Farmácia Centro",
      address: "Rua das Flores, 123 - Centro",
      manager: "Carlos Silva",
      employees: 8,
      revenue: "R$ 45.000",
      status: "active",
      phone: "(11) 3333-4444",
      country: "Brasil",
      state: "São Paulo",
      city: "São Paulo",
      fullAddress: "Rua das Flores, Centro",
      number: "123",
      description: "Unidade principal no centro da cidade",
    },
    {
      id: 2,
      name: "Farmácia Norte",
      address: "Av. Paulista, 456 - Norte",
      manager: "Ana Santos",
      employees: 12,
      revenue: "R$ 62.000",
      status: "active",
      phone: "(11) 5555-6666",
      country: "Brasil",
      state: "São Paulo",
      city: "São Paulo",
      fullAddress: "Av. Paulista, Norte",
      number: "456",
      description: "Unidade com maior movimento",
    },
    {
      id: 3,
      name: "Farmácia Sul",
      address: "Rua do Comércio, 789 - Sul",
      manager: "João Costa",
      employees: 6,
      revenue: "R$ 38.000",
      status: "active",
      phone: "(11) 7777-8888",
      country: "Brasil",
      state: "São Paulo",
      city: "São Paulo",
      fullAddress: "Rua do Comércio, Sul",
      number: "789",
      description: "Unidade em região comercial",
    },
    {
      id: 4,
      name: "Farmácia Oeste",
      address: "Rua das Palmeiras, 321 - Oeste",
      manager: "Maria Oliveira",
      employees: 4,
      revenue: "R$ 0",
      status: "inactive",
      phone: "(11) 9999-0000",
      country: "Brasil",
      state: "São Paulo",
      city: "São Paulo",
      fullAddress: "Rua das Palmeiras, Oeste",
      number: "321",
      description: "Unidade temporariamente fechada para reformas",
    },
  ])

  const filteredUnits = showActiveOnly ? units.filter((unit) => unit.status === "active") : units
  const activeUnits = units.filter((unit) => unit.status === "active").length
  const totalEmployees = units.reduce((sum, unit) => sum + unit.employees, 0)
  const totalRevenue = units.reduce(
    (sum, unit) => sum + Number.parseFloat(unit.revenue.replace("R$ ", "").replace(".", "")),
    0,
  )

  const handleToggleStatus = (unitId: number) => {
    setUnits((prevUnits) =>
      prevUnits.map((unit) =>
        unit.id === unitId ? { ...unit, status: unit.status === "active" ? "inactive" : "active" } : unit,
      ),
    )
    console.log(`[v0] Unidade ${unitId} status alterado`)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Nova unidade criada:", formData)
    setIsCreateDialogOpen(false)
    setFormData({
      name: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      address: "",
      number: "",
      description: "",
    })
  }

  const handleEditClick = (unit: any) => {
    setEditingUnit(unit)
    setFormData({
      name: unit.name,
      phone: unit.phone,
      country: unit.country,
      state: unit.state,
      city: unit.city,
      address: unit.fullAddress,
      number: unit.number,
      description: unit.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Unidade editada:", { id: editingUnit.id, ...formData })
    setIsEditDialogOpen(false)
    setEditingUnit(null)
    setFormData({
      name: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      address: "",
      number: "",
      description: "",
    })
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Unidades</h1>
            <p className="text-muted-foreground">Gerencie as unidades da rede</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nova Unidade
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Nova Unidade</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                {/* ... existing form fields ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Unidade</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ex: Farmácia Centro"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      placeholder="Brasil"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="São Paulo"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="São Paulo"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">Endereço (Rua + Bairro)</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Rua das Flores, Centro"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      value={formData.number}
                      onChange={(e) => handleInputChange("number", e.target.value)}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (Extra)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Informações adicionais sobre a unidade..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="gradient-primary text-white">
                    Criar Unidade
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total de Unidades" value={units.length.toString()} icon={Building2} />
          <StatCard title="Unidades Ativas" value={activeUnits.toString()} icon={Building2} />
          <StatCard title="Total Funcionários" value={totalEmployees.toString()} icon={Users} />
          <StatCard title="Receita Total" value={`R$ ${totalRevenue.toLocaleString()}`} icon={DollarSign} />
        </div>

        {/* Search and Filters */}
        <Card className="gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar unidades por nome, endereço ou gerente..."
                  className="pl-10 bg-input border-border"
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

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Unidade</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* ... existing form fields ... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome da Unidade</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: Farmácia Centro"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Telefone</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-country">País</Label>
                  <Input
                    id="edit-country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="Brasil"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-state">Estado</Label>
                  <Input
                    id="edit-state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="São Paulo"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-city">Cidade</Label>
                <Input
                  id="edit-city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="São Paulo"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="edit-address">Endereço (Rua + Bairro)</Label>
                  <Input
                    id="edit-address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Rua das Flores, Centro"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-number">Número</Label>
                  <Input
                    id="edit-number"
                    value={formData.number}
                    onChange={(e) => handleInputChange("number", e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição (Extra)</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Informações adicionais sobre a unidade..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="gradient-primary text-white">
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Units Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredUnits.map((unit) => (
            <Card
              key={unit.id}
              className={`gradient-card border-border/50 ${unit.status === "inactive" ? "opacity-60" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{unit.name}</CardTitle>
                    <Badge variant={unit.status === "active" ? "default" : "secondary"} className="mt-1">
                      {unit.status === "active" ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0" onClick={() => handleEditClick(unit)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-8 h-8 p-0"
                      onClick={() => handleToggleStatus(unit.id)}
                    >
                      <Power className={`w-4 h-4 ${unit.status === "active" ? "text-red-500" : "text-green-500"}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{unit.address}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Gerente:</span>
                    <span className="text-sm font-medium text-foreground">{unit.manager}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Funcionários:</span>
                    <span className="text-sm font-medium text-foreground">{unit.employees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Receita Mensal:</span>
                    <span
                      className={`text-sm font-medium ${unit.status === "active" ? "text-green-500" : "text-gray-400"}`}
                    >
                      {unit.revenue}
                    </span>
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
