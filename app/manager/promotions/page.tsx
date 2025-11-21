"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/ui/stat-card"
import { Tag, Plus, Search, Calendar, Edit, Power } from "lucide-react"
import { useState } from "react"

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      name: "Desconto de Verão",
      type: "Percentual",
      discount: "20%",
      minPurchase: "R$ 50",
      period: "30/11/2024 - 30/12/2024",
      usage: "45/200",
      products: ["Paracetamol", "Dipirona", "+1"],
      status: "active",
    },
    {
      id: 2,
      name: "Compre 2 Leve 3",
      type: "Compre X Leve Y",
      discount: "Leve 3",
      minPurchase: "Compra mín: R$ 50",
      period: "14/11/2024 - 14/12/2024",
      usage: "23/100",
      products: ["Vitamina C", "Vitamina D", "+1"],
      status: "active",
    },
    {
      id: 3,
      name: "Black Friday",
      type: "Valor Fixo",
      discount: "R$ 30",
      minPurchase: "Compra mín: R$ 200",
      period: "28/11/2024 - 28/11/2024",
      usage: "89/500",
      products: [],
      status: "expired",
    },
  ])

  const handleToggleStatus = (promotionId: number) => {
    setPromotions((prevPromotions) =>
      prevPromotions.map((promotion) =>
        promotion.id === promotionId
          ? { ...promotion, status: promotion.status === "active" ? "inactive" : "active" }
          : promotion,
      ),
    )
    console.log(`[v0] Promoção ${promotionId} status alterado`)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Promoções</h1>
            <p className="text-muted-foreground">Crie e gerencie promoções e ofertas</p>
          </div>
          <Button className="gradient-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nova Promoção
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total de Promoções" value="3" icon={Tag} />
          <StatCard title="Promoções Ativas" value="2" icon={Tag} />
          <StatCard title="Agendadas" value="0" icon={Calendar} />
        </div>

        {/* Search */}
        <Card className="gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar promoções..." className="pl-10 bg-input border-border" />
            </div>
          </CardContent>
        </Card>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="gradient-card border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{promotion.name}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge
                        variant={
                          promotion.status === "active"
                            ? "default"
                            : promotion.status === "expired"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {promotion.status === "active"
                          ? "Ativa"
                          : promotion.status === "expired"
                            ? "Expirada"
                            : promotion.status === "inactive"
                              ? "Inativa"
                              : "Agendada"}
                      </Badge>
                      <Badge variant="outline">{promotion.type}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-8 h-8 p-0"
                      onClick={() => handleToggleStatus(promotion.id)}
                      disabled={promotion.status === "expired"}
                    >
                      <Power
                        className={`w-4 h-4 ${
                          promotion.status === "expired"
                            ? "text-gray-400"
                            : promotion.status === "active"
                              ? "text-red-500"
                              : "text-green-500"
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Desconto:</span>
                    <span className="text-sm font-medium text-blue-500">{promotion.discount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Compra mín:</span>
                    <span className="text-sm font-medium text-foreground">{promotion.minPurchase}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Período:</span>
                  </div>
                  <p className="text-xs text-foreground">{promotion.period}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Usos:</span>
                    <span className="text-sm font-medium text-foreground">{promotion.usage}</span>
                  </div>
                </div>

                {promotion.products.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">Produtos:</span>
                    <div className="flex flex-wrap gap-1">
                      {promotion.products.map((product, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>
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
