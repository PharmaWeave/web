"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/ui/stat-card"
import { Package, Search, AlertTriangle, Edit, Power, Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { StatusEnum, StatusType } from "@/@types/status"
import ApiService, { ApiResponse } from "@/services/api"
import URLS from "@/services/urls"
import { Button } from "@/components/ui/button"
import normalize from "@/utils/nomalize"
import useAuth from "@/hooks/use-auth"
import ProductDialog, { ProductForm } from "@/components/product-dialog"
import Toast from "@/utils/toast"

export interface Product {
  id: number;
  name: string;
  description: string;
  brand_id: number;

  info: {
    id: number;
    price: number;
    stock: number;
    branch_id: number;
    product_id: number;

    createdAt: Date;
    updatedAt: Date;
    status: StatusType;
  }

  createdAt: Date;
  updatedAt: Date;
  status: StatusType;
}

interface ProductInfoStatus {
  status: StatusType
}

export default function ProductsPage() {
  const { auth } = useAuth();

  const [editingProduct, setEditingProduct] = useState<Product | undefined>()

  const [showActiveOnly, setShowActiveOnly] = useState(true)
  const [search, setSearch] = useState("")

  const [products, setProducts] = useState<Product[]>([])

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, []);

  const fetchProducts = () => {
    ApiService.get(URLS.PRODUCT.LIST, {}, auth?.access_token).then((data: ApiResponse<Product[]>) => setProducts(data.data))
  }

  const IsProductActive = (product: Product) => { return product.info.status === StatusEnum.ACTIVE && product.status === StatusEnum.ACTIVE; };

  const filteredProducts = useMemo(() => {
    let current = products;

    if (showActiveOnly) {
      current = current.filter((product) => IsProductActive(product));
    }

    if (search.trim().length > 0) {
      const s = normalize(search.toLowerCase());

      current = current.filter((product) =>
        normalize(product.name.toLowerCase()).includes(s)
      );
    }

    return current;
  }, [showActiveOnly, search, products]);

  const hasLowStock = (product: Product) => { return product.info.stock <= 10; };

  const countLowStock = () => {
    let counter = 0;

    for (let product of products) {
      if (hasLowStock(product) && IsProductActive(product)) counter++;
    }

    return counter;
  };

  const handleSubmit = (e: React.FormEvent, form: ProductForm) => {
    e.preventDefault()

    const numericPrice = Number(form.price.replace(/\./g, "").replace(/\,/g, ""))
    const numericStock = Number(form.stock)

    const body = {
      name: form.name,
      description: form.description,
      info: {
        price: numericPrice,
        stock: numericStock
      }
    }

    const api = editingProduct
      ? ApiService.patch(URLS.PRODUCT.UPDATE(editingProduct.id), body, auth?.access_token)
      : ApiService.post(URLS.PRODUCT.POST, body, auth?.access_token)

    api.then(() => {
      fetchProducts()

      setIsDialogOpen(false)
      Toast.success(editingProduct ? "Produto atualizado!" : "Produto criado!")
    }).finally(() => setEditingProduct(undefined))
  };

  const handleInactivate = (product_info_id: number) => {
    ApiService.patch(URLS.PRODUCT.STATUS(product_info_id), {}, auth?.access_token)
      .then((data: ApiResponse<ProductInfoStatus>) => {
        fetchProducts()

        Toast.success(`Produto ${data.data.status === StatusEnum.ACTIVE ? "ativado" : "desativado"}!`)
      })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
            <p className="text-muted-foreground">Gerencie o estoque da farmácia</p>
          </div>
          <Button className="gradient-primary text-white" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>

          <ProductDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleSubmit={handleSubmit}
            setEditingProduct={setEditingProduct}
            editingProduct={editingProduct}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Total de Produtos" value={products.length} icon={Package} />
          <StatCard title="Estoque Baixo" value={countLowStock()} icon={AlertTriangle} />
        </div>

        <Card className="gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos por nome..."
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto">
          {filteredProducts.map((product) => (
            <Card key={product.id} className={`gradient-card border-border/50 ${!(IsProductActive(product)) ? "opacity-60" : ""}`}>
              <CardHeader className="flex justify-between gap-2 pb-3">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <div className="flex gap-2">
                    {!(IsProductActive(product)) && (
                      <Badge variant="outline" className="w-fit">
                        Inativo
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{product.description}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0"
                    onClick={() => {
                      setEditingProduct(product);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0"
                    onClick={() => handleInactivate(product.info.id)}
                  >
                    <Power className={`w-4 h-4 ${IsProductActive(product) ? "text-red-500" : "text-green-500"}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Preço:</span>
                    <span className="text-sm font-medium text-foreground">R$ {product.info.price / 100}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estoque:</span>
                    <span
                      className={`text-sm font-medium ${hasLowStock(product) ? "text-red-500" : IsProductActive(product) ? "text-green-500" : "text-gray-500"}`}
                    >
                      {product.info.stock} unidades
                    </span>
                  </div>
                  {hasLowStock(product) && IsProductActive(product) && (
                    <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-xs text-red-500 font-medium">Estoque baixo!</p>
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
