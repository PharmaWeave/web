"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/ui/stat-card"
import { Package, Search, AlertTriangle } from "lucide-react"
import { useState } from "react"

export default function EmployeeProductsPage() {
  const [showActiveOnly, setShowActiveOnly] = useState(true)

  const products = [
    {
      id: 1,
      name: "Dipirona 500mg",
      category: "Analgésicos",
      price: "R$ 12.90",
      stock: 150,
      status: "normal",
      active: true,
    },
    {
      id: 2,
      name: "Paracetamol 750mg",
      category: "Analgésicos",
      price: "R$ 8.50",
      stock: 8,
      status: "low",
      active: true,
    },
    {
      id: 3,
      name: "Vitamina C 1g",
      category: "Vitaminas",
      price: "R$ 25.90",
      stock: 75,
      status: "normal",
      active: true,
    },
    {
      id: 4,
      name: "Omeprazol 20mg",
      category: "Gastroenterologia",
      price: "R$ 15.90",
      stock: 12,
      status: "low",
      active: true,
    },
    {
      id: 5,
      name: "Amoxicilina 500mg",
      category: "Antibióticos",
      price: "R$ 18.90",
      stock: 45,
      status: "normal",
      active: true,
    },
    {
      id: 6,
      name: "Aspirina 100mg",
      category: "Analgésicos",
      price: "R$ 6.50",
      stock: 0,
      status: "inactive",
      active: false,
    },
  ]

  const filteredProducts = showActiveOnly ? products.filter((product) => product.active) : products

  return (
    <DashboardLayout userRole="employee" userName="Usuário">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
          <p className="text-muted-foreground">Consulte o estoque da farmácia</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total de Produtos" value="6" icon={Package} />
          <StatCard title="Estoque Baixo" value="2" icon={AlertTriangle} />
          <StatCard title="Categorias" value="6" icon={Package} />
        </div>

        <Card className="gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos por nome ou categoria..."
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className={`gradient-card border-border/50 ${!product.active ? "opacity-60" : ""}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="w-fit">
                    {product.category}
                  </Badge>
                  {!product.active && (
                    <Badge variant="outline" className="w-fit">
                      Inativo
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Preço:</span>
                    <span className="text-sm font-medium text-foreground">{product.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estoque:</span>
                    <span
                      className={`text-sm font-medium ${product.status === "low" ? "text-red-500" : product.active ? "text-green-500" : "text-gray-500"}`}
                    >
                      {product.stock} unidades
                    </span>
                  </div>
                  {product.status === "low" && product.active && (
                    <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-2 rounded-lg">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs">Estoque baixo!</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
