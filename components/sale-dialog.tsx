"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ApiService from "@/services/api"
import URLS from "@/services/urls"
import { Product } from "@/pages/products"
import { Customer } from "@/pages/clients"
import useAuth from "@/hooks/use-auth"
import ComboBox from "./combobox"
import Toast from "@/utils/toast"
import { Promotion } from "@/app/manager/promotions/page"

export interface SaleForm {
    user_id?: number;
    sale_items: {
        product_id: number;
        quantity: number;
    }[],
    promotion_id?: number | null;
}

interface SaleDialogProps {
    isDialogOpen: boolean
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>

    handleSubmit: (e: React.FormEvent, form: SaleForm) => Promise<boolean>
}

export default function SaleDialog({ isDialogOpen, setIsDialogOpen, handleSubmit }: SaleDialogProps) {
    const { auth } = useAuth()

    const defaultForm: SaleForm = {
        user_id: undefined,
        sale_items: [],
        promotion_id: undefined
    }

    const [formData, setFormData] = useState<SaleForm>(defaultForm)
    const [products, setProducts] = useState<Product[]>([])
    const [users, setUsers] = useState<Customer[]>([])
    const [promotions, setPromotions] = useState<Promotion[]>([])
    const [applicablePromotions, setApplicablePromotions] = useState<Promotion[]>([])
    const [total, setTotal] = useState<number>(0)

    useEffect(() => {
        if (isDialogOpen) {
            ApiService.get(URLS.PRODUCT.LIST, {}, auth?.access_token).then(res => setProducts(res.data))
            ApiService.get(URLS.SALE.USER.METRICS, {}, auth?.access_token).then(res => setUsers(res.data))
            ApiService.get(URLS.PROMOTION.LIST, {}, auth?.access_token).then(res => setPromotions(res.data))
        }

        setFormData(defaultForm)
        setApplicablePromotions([])
        setTotal(0)
    }, [isDialogOpen])

    useEffect(() => {
        if (formData.sale_items.length === 0) {
            setApplicablePromotions([])
            setFormData(prev => ({ ...prev, promotion_id: undefined }))
            return
        }

        const selectedProductIds = formData.sale_items.map(p => p.product_id)
        const filteredPromotions = promotions.filter(promo =>
            promo.products.some(pp => selectedProductIds.includes(pp.product_info.product_id))
        )

        setApplicablePromotions(filteredPromotions)

        if (formData.promotion_id && !filteredPromotions.some(p => p.id === formData.promotion_id)) {
            setFormData(prev => ({ ...prev, promotion_id: undefined }))
        }
    }, [formData.sale_items, promotions])

    const calculatePromotionDiscount = (
        promotion: Promotion,
        product_mapping: { product_info: Product; quantity: number }[]
    ) => {
        let totalDiscount = 0
        let applied = false

        if (new Date() < new Date(promotion.start) || new Date() > new Date(promotion.end)) return 0

        const promoProducts = promotion.products.map(pp => pp.product_info.product_id)

        if (promotion.type === "P") {
            let remaining = promotion.constraint
            const sorted = product_mapping
                .filter(p => promoProducts.includes(p.product_info.id))
                .sort((a, b) => b.product_info.info.price - a.product_info.info.price)

            for (const item of sorted) {
                const count = Math.min(item.quantity, remaining)
                if (count <= 0) continue

                const discount = Math.floor(count * item.product_info.info.price * (promotion.value / 100))
                totalDiscount -= discount
                remaining -= count
                applied = true

                if (remaining <= 0) break
            }
        } else {
            const subtotal = product_mapping
                .filter(p => promoProducts.includes(p.product_info.id))
                .reduce((sum, p) => sum + p.product_info.info.price * p.quantity, 0)

            const eligible = subtotal > promotion.constraint
            if (eligible) {
                totalDiscount -= promotion.value
                applied = true
            }
        }

        if (!applied) return 0
        return totalDiscount
    }

    useEffect(() => {
        if (formData.sale_items.length === 0) {
            setTotal(0)
            setApplicablePromotions([])
            setFormData(prev => ({ ...prev, promotion_id: undefined }))
            return
        }

        const productMap = formData.sale_items.map(item => ({
            product_info: products.find(p => p.id === item.product_id)!,
            quantity: item.quantity
        }))

        const validPromotions = promotions.filter(promo => calculatePromotionDiscount(promo, productMap) !== 0)
        setApplicablePromotions(validPromotions)

        const subtotal = productMap.reduce((sum, p) => sum + p.product_info.info.price * p.quantity, 0)
        let totalAmount = subtotal
        if (formData.promotion_id) {
            const selectedPromo = validPromotions.find(p => p.id === formData.promotion_id)
            if (selectedPromo) totalAmount += calculatePromotionDiscount(selectedPromo, productMap)
            else setFormData(prev => ({ ...prev, promotion_id: undefined }))
        }

        setTotal(totalAmount)
    }, [formData.sale_items, formData.promotion_id, products, promotions])

    const handleAddProduct = (product: Product) => {
        const existing = formData.sale_items.find(p => p.product_id === product.id)
        if (!existing) {
            setFormData(prev => ({
                ...prev,
                sale_items: [...(prev.sale_items || []), { product_id: product.id, quantity: 1 }]
            }))
        }
    }

    const handleQuantityChange = (productId: number, quantity: number) => {
        const stock = Number(products.find(ps => ps.id === productId)?.info.stock)
        if (quantity > stock) {
            Toast.error(`Há somente ${stock} em estoque!`)
            return
        }

        setFormData(prev => ({
            ...prev,
            sale_items: prev.sale_items.map(p =>
                p.product_id === productId ? { ...p, quantity } : p
            )
        }))
    }

    const handleRemoveProduct = (productId: number) => {
        setFormData(prev => ({
            ...prev,
            sale_items: prev.sale_items.filter(p => p.product_id !== productId)
        }))
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="flex flex-col sm:max-w-[80vw] h-[50vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Nova Venda</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={async e => {
                        if (await handleSubmit(e, formData)) setFormData(defaultForm)
                    }}
                    className="space-y-4"
                >
                    <ComboBox
                        label="Cliente"
                        items={users}
                        displayKeys={["user_name", "user_register"]}
                        valueKey="user_id"
                        value={formData.user_id}
                        placeholder="Selecione um cliente..."
                        onChange={(v) =>
                            setFormData(prev => ({ ...prev, user_id: v }))
                        }
                    />

                    <ComboBox
                        label="Adicionar Produto"
                        items={products}
                        displayKeys={["name"]}
                        valueKey="id"
                        placeholder="Selecione os produtos..."
                        onChange={(id) => {
                            const p = products.find(x => x.id === id)
                            if (p) handleAddProduct(p)
                        }}
                    />

                    {formData.sale_items?.length > 0 && (
                        <div className="space-y-2 border-t pt-2">
                            <h4 className="font-medium">Produtos selecionados</h4>
                            {formData.sale_items.map(p => (
                                <div key={p.product_id} className="grid grid-cols-4 gap-2">
                                    <span>
                                        {products.find(ps => ps.id === p.product_id)?.name} -
                                        R$ {(products.find(ps => ps.id === p.product_id)?.info.price ?? 0) / 100}
                                    </span>
                                    <Input
                                        type="number"
                                        value={p.quantity}
                                        min={1}
                                        max={products.find(ps => ps.id === p.product_id)?.info.stock}
                                        className="w-20"
                                        onChange={e => handleQuantityChange(p.product_id, Number(e.target.value))}
                                    />
                                    <span>Subtotal: R$ {((products.find(ps => ps.id === p.product_id)?.info.price ?? 0) * p.quantity) / 100}</span>
                                    <Button size="sm" className="ml-auto w-24 hover:cursor-pointer" variant="destructive" onClick={() => handleRemoveProduct(p.product_id)}>
                                        Remover
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {applicablePromotions.length > 0 && (
                        <ComboBox
                            label="Promoção aplicável"
                            items={applicablePromotions}
                            displayKeys={["title", "description"]}
                            valueKey="id"
                            value={formData.promotion_id}
                            placeholder="Selecione uma promoção..."
                            onChange={(v) =>
                                setFormData(prev => ({ ...prev, promotion_id: v }))
                            }
                        />
                    )}

                    <div className="flex justify-end font-bold">
                        Total: R$ {(total / 100).toFixed(2)}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="gradient-primary text-white">
                            Registrar Venda
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
