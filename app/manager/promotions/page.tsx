"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/ui/stat-card"
import { Tag, Plus, Search, Calendar, Trash2Icon, CheckCircle2Icon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { StatusType } from "@/@types/status"
import useAuth from "@/hooks/use-auth"
import URLS from "@/services/urls"
import ApiService from "@/services/api"
import normalize from "@/utils/nomalize"
import PromotionDialog, { PromotionForm } from "@/components/dialog/promotion-dialog"
import Toast from "@/utils/toast"

export interface Promotion {
  id: number;
  title: string;
  description: string;
  type: string;
  value: number;
  constraint: number;
  start: string;
  end: string;
  branch_id: number;
  products: PromotionProduct[];

  createdAt: string;
  updatedAt: string;
  status: StatusType;
}

interface PromotionProduct {
  id: number;
  product_info_id: number;
  promotion_id: number;
  product_info: ProductInfo;

  createdAt: string;
  updatedAt: string;
  status: StatusType;
}

interface ProductInfo {
  id: number;
  price: number;
  stock: number;
  product_id: number;
  branch_id: number;
  product: Product;

  createdAt: string;
  updatedAt: string;
  status: StatusType;
}

interface Product {
  id: number;
  name: string;
  description: string;
  brand_id: number;

  createdAt: string;
  updatedAt: string;
  status: StatusType;
}

export default function PromotionsPage() {
  const { auth } = useAuth()

  const [editingPromotion, setEditingPromotion] = useState<Promotion | undefined>()

  const [promotions, setPromotions] = useState<Promotion[]>([])

  const [search, setSearch] = useState("")

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchPromotions = () => {
    ApiService.get(URLS.PROMOTION.LIST, {}, auth?.access_token).then((data: { data: Promotion[] }) => setPromotions(data.data));
  }

  useEffect(() => {
    fetchPromotions()
  }, []);

  const IsPromotionActive = (promotion: Promotion) => {
    const now = new Date()

    const start = new Date(promotion.start)
    const end = new Date(promotion.end)

    if (start <= now && end >= now) return 0;
    if (end <= now) return -1;
    return 1;
  };

  const filteredPromotions = useMemo(() => {
    let current = promotions;

    if (search.trim().length > 0) {
      const s = normalize(search.toLowerCase());

      current = current.filter((promotion) =>
        normalize(promotion.title.toLowerCase()).includes(s)
        || normalize(promotion.description.toLowerCase()).includes(s)
      );
    }

    return current;
  }, [search, promotions]);

  const handleDelete = (promotionId: number) => {
    ApiService.delete(URLS.PROMOTION.DELETE(promotionId), auth?.access_token)
      .then(() => {
        fetchPromotions()
      })
  }

  const handleFinalize = (promotionId: number) => {
    ApiService.patch(URLS.PROMOTION.FINALIZE(promotionId), {}, auth?.access_token)
      .then(() => {
        fetchPromotions()
      })
  }

  const handleSubmit = (e: React.FormEvent, form: PromotionForm) => {
    e.preventDefault()

    const value = form.type === "V" ? form.value * 100 : form.value
    const constraint = form.type === "V" ? form.constraint * 100 : form.constraint
    const start = new Date(form.start).toISOString()
    const end = new Date(form.end).toISOString()

    const body = {
      ...form,
      value: value,
      constraint: constraint,
      branch_id: auth?.branch_id,
      start: start,
      end: end,
    }

    const api = ApiService.post(URLS.PROMOTION.POST, body, auth?.access_token)

    api.then(() => {
      fetchPromotions()

      setIsDialogOpen(false)
      Toast.success("Promoção criada!")
    }).finally(() => setEditingPromotion(undefined))
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col p-6 h-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Promoções</h1>
            <p className="text-muted-foreground">Crie e gerencie promoções e ofertas</p>
          </div>
          <Button className="gradient-primary text-white" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Promoção
          </Button>

          <PromotionDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleSubmit={handleSubmit}
            setEditingPromotion={setEditingPromotion}
            editingPromotion={editingPromotion}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <StatCard title="Promoções Ativas" value={promotions.filter(p => !IsPromotionActive(p)).length} icon={Tag} />
          <StatCard title="Agendadas" value={promotions.filter(p => IsPromotionActive(p) > 0).length} icon={Calendar} />
        </div>

        <Card className="gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar promoções por nome..."
                className="pl-10 bg-input border-border"
                onChange={e => setSearch(e.currentTarget.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
          {filteredPromotions.map((promotion) => (
            <Card key={promotion.id} className="gradient-card border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{promotion.title}</CardTitle>
                    <span className="text-sm">
                      {promotion.description}
                    </span>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={!IsPromotionActive(promotion) ? "default" : IsPromotionActive(promotion) > 0 ? "destructive" : "outline"}>
                        {!IsPromotionActive(promotion) ? "Ativa" : IsPromotionActive(promotion) > 0 ? "Agendada" : "Expirada"}
                      </Badge>
                      <Badge variant="outline">{promotion.type === "P" ? "Percentual" : "Valor Fixo"}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {IsPromotionActive(promotion) >= 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0"
                        onClick={() => handleFinalize(promotion.id)}
                      >
                        <CheckCircle2Icon className="w-4 h-4 text-green-500" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-8 h-8 p-0"
                      onClick={() => handleDelete(promotion.id)}
                    >
                      <Trash2Icon className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Desconto:</span>
                    <span className="text-sm font-medium text-blue-500">
                      {promotion.type !== "P" && "R$"} {promotion.type === "V" ? (promotion.value / 100).toFixed(2) : promotion.value}{promotion.type === "P" && "%"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{promotion.type === "V" ? "Compra mín:" : "Usos por compra:"}</span>
                    <span className="text-sm font-medium text-foreground">
                      {promotion.type === "V" && "R$"} {promotion.type === "V" ? (promotion.constraint / 100).toFixed(2) : promotion.constraint}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Período:</span>
                  </div>
                  <p className="flex flex-col justify-center items-center text-xs text-foreground">
                    <span>{new Date(promotion.start).toLocaleString("pt-BR")}</span>
                    até
                    <span>{new Date(promotion.end).toLocaleString("pt-BR")}</span>
                  </p>
                </div>

                {promotion.products.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">Produtos:</span>
                    <div className="flex flex-wrap gap-1">
                      {promotion.products.map((product, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {product.product_info.product.name}
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
