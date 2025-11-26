"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/ui/stat-card"
import { ShoppingCart, Plus, DollarSign, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { StatusType } from "@/@types/status"
import ApiService, { ApiResponse } from "@/services/api"
import useAuth from "@/hooks/use-auth"
import URLS from "@/services/urls"
import { formatCPF } from "@/utils/cpf"
import SaleDialog, { SaleForm } from "@/components/sale-dialog"
import Toast from "@/utils/toast"

export interface Sale {
    sale_id: number;
    sale_total_amount: number;
    sale_total_items: number;
    sale_promotion_id?: number;

    promotion_id?: number
    promotion_title?: string

    user_id: number;
    user_name: string;
    user_register: string;

    employee_id: number;
    employee_name: string;
    employee_register: string;

    sale_created_at: string;
    sale_updated_at: string;
    sale_status: StatusType;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

interface SaleResponse {
    data: Sale[];
    pagination: Pagination;
}

export default function SalesPage() {
    const { auth } = useAuth()

    const [sales, setSales] = useState<Sale[]>([])
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, total_pages: 1 })
    const [loading, setLoading] = useState(false)

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const fetchSales = async (page: number) => {
        if (!auth) return
        setLoading(true)
        try {
            ApiService.get(URLS.SALE.LIST(page, pagination.limit), {}, auth.access_token)
                .then((data: SaleResponse) => {
                    setSales(data.data)
                    setPagination(data.pagination)
                })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSales(1)
    }, [auth])

    const handlePrev = () => {
        if (pagination.page > 1) fetchSales(pagination.page - 1)
    }

    const handleNext = () => {
        if (pagination.page < pagination.total_pages) fetchSales(pagination.page + 1)
    }

    const handleSubmit = async (e: React.FormEvent, form: SaleForm): Promise<boolean> => {
        e.preventDefault()

        if (!form.user_id || !form.sale_items.length) return Promise.resolve(false);

        const body: SaleForm = {
            user_id: form.user_id,
            sale_items: form.sale_items,
            promotion_id: form.promotion_id
        }

        return ApiService.post(URLS.SALE.POST, body, auth?.access_token)
            .then(() => {
                fetchSales(pagination.page)
                setIsDialogOpen(false)

                Toast.success("Compra registrada!")

                return true
            })
            .catch(() => {
                return false
            })
    }

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
                        <p className="text-muted-foreground">Gerencie as vendas da farmácia</p>
                    </div>
                    <Button className="gradient-primary text-white" onClick={() => setIsDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Venda
                    </Button>

                    <SaleDialog
                        isDialogOpen={isDialogOpen}
                        setIsDialogOpen={setIsDialogOpen}
                        handleSubmit={handleSubmit}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <StatCard
                        title="Vendas Hoje"
                        value="47"
                        subtitle="+15% vs ontem"
                        icon={ShoppingCart}
                    />
                    <StatCard
                        title="Faturamento Hoje"
                        value="R$ 6,847"
                        subtitle="+8% vs ontem"
                        icon={DollarSign}
                    />
                </div>

                <Card className="gradient-card border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Vendas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">ID</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Cliente</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Funcionário</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Itens</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Total</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Horário</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.map((sale) => (
                                        <tr key={sale.sale_id} className="border-b border-border/50 hover:bg-secondary/50">
                                            <td className="p-3 text-sm font-medium text-foreground">#{sale.sale_id}</td>
                                            <td className="p-3 text-sm text-foreground">
                                                {sale.user_name} - ({formatCPF(sale.user_register)})
                                            </td>
                                            <td className="p-3 text-sm text-muted-foreground">
                                                {sale.employee_name} - ({formatCPF(sale.employee_register)})
                                            </td>
                                            <td className="p-3 text-sm text-foreground">{sale.sale_total_items}</td>
                                            <td className="p-3 text-sm font-medium text-green-500">{(sale.sale_total_amount / 100).toFixed(2)}</td>
                                            <td className="p-3 text-sm text-foreground">{new Date(sale.sale_created_at).toLocaleString("pt-BR")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end items-center gap-2 mt-4">
                            <Button
                                size="sm"
                                onClick={handlePrev}
                                disabled={pagination.page === 1 || loading}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span>
                                Página {pagination.page} de {pagination.total_pages}
                            </span>
                            <Button
                                size="sm"
                                onClick={handleNext}
                                disabled={pagination.page === pagination.total_pages || loading}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
