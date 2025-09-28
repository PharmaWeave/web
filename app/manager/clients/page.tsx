"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/ui/stat-card"
import { User, Plus, Search, DollarSign, ShoppingCart, Eye, Edit, Power } from "lucide-react"
import { useState } from "react"

export default function ClientsPage() {
  const [showActiveOnly, setShowActiveOnly] = useState(true)

  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Maria Santos",
      email: "maria@email.com",
      cpf: "123.456.789-01",
      purchases: 15,
      totalSpent: "R$ 450.75",
      lastPurchase: "2024-01-15",
      status: "active",
    },
    {
      id: 2,
      name: "João Silva",
      email: "joao@email.com",
      cpf: "234.567.890-12",
      purchases: 8,
      totalSpent: "R$ 230.40",
      lastPurchase: "2024-01-10",
      status: "active",
    },
    {
      id: 3,
      name: "Pedro Oliveira",
      email: "pedro@email.com",
      cpf: "456.789.012-34",
      purchases: 12,
      totalSpent: "R$ 320.50",
      lastPurchase: "2024-01-08",
      status: "active",
    },
    {
      id: 4,
      name: "Carla Mendes",
      email: "carla@email.com",
      cpf: "567.890.123-45",
      purchases: 31,
      totalSpent: "R$ 890.25",
      lastPurchase: "2024-01-14",
      status: "active",
    },
    {
      id: 5,
      name: "Roberto Silva",
      email: "roberto@email.com",
      cpf: "789.012.345-67",
      purchases: 3,
      totalSpent: "R$ 85.50",
      lastPurchase: "2023-12-20",
      status: "inactive",
    },
  ])

  const filteredClients = showActiveOnly ? clients.filter((client) => client.status === "active") : clients

  const handleToggleStatus = (clientId: number) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === clientId ? { ...client, status: client.status === "active" ? "inactive" : "active" } : client,
      ),
    )
    console.log(`[v0] Cliente ${clientId} status alterado`)
  }

  return (
    <DashboardLayout userRole="manager" userName="Gerente">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">Gerencie os clientes da farmácia</p>
          </div>
          <Button className="gradient-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total de Clientes" value="5" icon={User} />
          <StatCard title="Clientes Ativos" value="4" icon={User} />
          <StatCard title="Total de Compras" value="88" icon={ShoppingCart} />
          <StatCard title="Receita Total" value="R$ 1891.90" icon={DollarSign} />
        </div>

        {/* Search and Filters */}
        <Card className="gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes por nome, email ou CPF..."
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

        {/* Clients Table */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Nome</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">CPF</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Compras</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total Gasto</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Última Compra</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className={`border-b border-border/50 ${client.status === "inactive" ? "opacity-60" : ""}`}
                    >
                      <td className="py-3 px-4 text-foreground">{client.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{client.email}</td>
                      <td className="py-3 px-4 text-muted-foreground">{client.cpf}</td>
                      <td className="py-3 px-4 text-foreground">{client.purchases}</td>
                      <td className="py-3 px-4 text-green-500 font-medium">{client.totalSpent}</td>
                      <td className="py-3 px-4 text-muted-foreground">{client.lastPurchase}</td>
                      <td className="py-3 px-4">
                        <Badge variant={client.status === "active" ? "default" : "secondary"}>
                          {client.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-8 h-8 p-0"
                            onClick={() => handleToggleStatus(client.id)}
                          >
                            <Power
                              className={`w-4 h-4 ${client.status === "active" ? "text-red-500" : "text-green-500"}`}
                            />
                          </Button>
                        </div>
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
