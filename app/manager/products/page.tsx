"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/ui/stat-card"
import { Package, Plus, Search, AlertTriangle, Edit, Power, DollarSign } from "lucide-react"

export default function ProductsPage() {
  const [showActiveOnly, setShowActiveOnly] = useState(true)

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Dipirona 500mg",
      category: "Analgésicos",
      price: "R$ 12.90",
      stock: 150,
      lowStock: false,
      status: "active",
    },
    {
      id: 2,
      name: "Paracetamol 750mg",
      category: "Analgésicos",
      price: "R$ 8.50",
      stock: 8,
      lowStock: true,
      status: "active",
    },
    {
      id: 3,
      name: "Vitamina C 1g",
      category: "Vitaminas",
      price: "R$ 25.90",
      stock: 75,
      lowStock: false,
      status: "active",
    },
    {
      id: 4,
      name: "Omeprazol 20mg",
      category: "Gastroenterologia",
      price: "R$ 15.90",
      stock: 12,
      lowStock: true,
      status: "active",
    },
    {
      id: 5,
      name: "Amoxicilina 500mg",
      category: "Antibióticos",
      price: "R$ 18.90",
      stock: 45,
      lowStock: false,
      status: "active",
    },
    {
      id: 6,
      name: "Aspirina 100mg",
      category: "Analgésicos",
      price: "R$ 6.50",
      stock: 0,
      lowStock: false,
      status: "inactive",
    },
  ])

  const filteredProducts = showActiveOnly ? products.filter((product) => product.status === "active") : products

  const handleToggleStatus = (productId: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, status: product.status === "active" ? "inactive" : "active" }
          : product,
      ),
    )
    console.log(`[v0] Produto ${productId} status alterado`)
  }

  return (
    <DashboardLayout userRole="manager" userName="Gerente">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
            <p className="text-muted-foreground">Gerencie o estoque da farmácia</p>
          </div>
          <Button className="gradient-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total de Produtos" value="6" icon={Package} />
          <StatCard title="Estoque Baixo" value="3" icon={AlertTriangle} />
          <StatCard title="Valor Total" value="R$ 5.101,30" icon={DollarSign} />
          <StatCard title="Categorias" value="6" icon={Package} />
        </div>

        {/* Search and Filters */}
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`gradient-card border-border/50 ${product.status === "inactive" ? "opacity-60" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {product.category}
                    </Badge>
                    {product.status === "inactive" && (
                      <Badge variant="outline" className="mt-1 ml-2">
                        Inativo
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-8 h-8 p-0"
                      onClick={() => handleToggleStatus(product.id)}
                    >
                      <Power className={`w-4 h-4 ${product.status === "active" ? "text-red-500" : "text-green-500"}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Preço:</span>
                    <span className="text-sm font-medium text-green-500">{product.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estoque:</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${product.lowStock ? "text-red-500" : "text-green-500"}`}>
                        {product.stock} unidades
                      </span>
                      {product.lowStock && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                </div>
                {product.lowStock && (
                  <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-xs text-red-500 font-medium">Estoque baixo!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
