"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import React, { useState, useEffect } from "react"
import { Promotion } from "@/app/manager/promotions/page"
import { Product } from "@/pages/products"
import ApiService, { ApiResponse } from "@/services/api"
import URLS from "@/services/urls"
import useAuth from "@/hooks/use-auth"
import ComboBox from "./combobox"
import { StatusEnum } from "@/@types/status"

export interface PromotionForm {
    title: string;
    description: string;
    type: string;
    value: number;
    constraint: number;
    start: string;
    end: string;
    product_info_ids: number[];
}

interface PromotionDialogProps {
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleSubmit: (e: React.FormEvent, form: PromotionForm, editingPromotion?: Promotion) => void;
    setEditingPromotion: React.Dispatch<React.SetStateAction<Promotion | undefined>>;
    editingPromotion?: Promotion;
}

export default function PromotionDialog({
    isDialogOpen,
    setIsDialogOpen,
    handleSubmit,
    setEditingPromotion,
    editingPromotion
}: PromotionDialogProps) {
    const { auth } = useAuth()

    const defaultForm: PromotionForm = {
        title: "",
        description: "",
        type: "V",
        value: 0,
        constraint: 0,
        start: new Date().toISOString().slice(0, 16),
        end: new Date().toISOString().slice(0, 16),
        product_info_ids: []
    }

    const [formData, setFormData] = useState<PromotionForm>(defaultForm)
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        if (isDialogOpen) {
            ApiService.get(URLS.PRODUCT.LIST, {}, auth?.access_token)
                .then((res: ApiResponse<Product[]>) => setProducts(res.data.filter(
                    p => p.info.status === StatusEnum.ACTIVE
                )))
        }
    }, [isDialogOpen])

    useEffect(() => {
        if (editingPromotion) {
            setFormData({
                title: editingPromotion.title,
                description: editingPromotion.description || "",
                type: editingPromotion.type,
                value: editingPromotion.value,
                constraint: editingPromotion.constraint,
                start: editingPromotion.start,
                end: editingPromotion.end,
                product_info_ids: editingPromotion.products.map(p => p.product_info.id)
            })
        } else {
            setFormData(defaultForm)
        }
    }, [editingPromotion, isDialogOpen])

    const handleInputChange = (field: keyof PromotionForm, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleAddProduct = (product: Product) => {
        const existing = formData.product_info_ids.find(id => id === product.info.id)
        if (!existing) {
            setFormData(prev => ({
                ...prev,
                product_info_ids: [...(prev.product_info_ids || []), product.info.id]
            }))
        }
    }

    const handleRemoveProduct = (productId: number) => {
        setFormData(prev => ({
            ...prev,
            product_info_ids: prev.product_info_ids.filter(id => id !== productId)
        }))
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setEditingPromotion(undefined)
            setIsDialogOpen(open)
        }}>
            <DialogContent className="max-w-[75vw] max-h-[75vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingPromotion ? "Editar Promoção" : "Nova Promoção"}</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        handleSubmit(e, formData, editingPromotion);
                        setFormData(defaultForm);
                    }}
                    className="space-y-4"
                >

                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            placeholder="Título da promoção"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Ex: Black Friday 2025"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Tipo</Label>

                        <div className="flex items-center gap-6">

                            {/* Valor Fixo */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.type === "V"}
                                    onChange={() =>
                                        setFormData(prev => ({
                                            ...prev,
                                            type: prev.type === "V" ? "" : "V"
                                        }))
                                    }
                                />
                                <span>Valor Fixo</span>
                            </label>

                            {/* Percentual */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.type === "P"}
                                    onChange={() =>
                                        setFormData(prev => ({
                                            ...prev,
                                            type: prev.type === "P" ? "" : "P"
                                        }))
                                    }
                                />
                                <span>Percentual</span>
                            </label>

                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="value">{formData.type === "V" ? "Valor de Desconto" : "Porcentagem de Desconto"}</Label>
                        <Input
                            id="value"
                            type="number"
                            value={formData.value}
                            min={1}
                            onChange={(e) => handleInputChange("value", Number(e.target.value))}
                            placeholder="0"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="constraint">{formData.type === "V" ? "Valor Mínimo da Compra" : "Usos por Compra"}</Label>
                        <Input
                            id="constraint"
                            type="number"
                            value={formData.constraint}
                            min={1}
                            onChange={(e) => handleInputChange("constraint", Number(e.target.value))}
                            placeholder="0"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="start">Início</Label>
                        <Input
                            id="start"
                            type="datetime-local"
                            value={formData.start}
                            onChange={(e) => handleInputChange("start", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="end">Fim</Label>
                        <Input
                            id="end"
                            type="datetime-local"
                            value={formData.end}
                            onChange={(e) => handleInputChange("end", e.target.value)}
                            required
                        />
                    </div>

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

                    {formData.product_info_ids?.length > 0 && (
                        <div className="space-y-2 border-t pt-2 max-h-[300px] overflow-auto">
                            <h4 className="font-medium">Produtos selecionados</h4>
                            {formData.product_info_ids.map(id => (
                                <div key={id} className="grid grid-cols-2 gap-2">
                                    <span>
                                        {products.find(ps => ps.info.id === id)?.name} -
                                        R$ {(products.find(ps => ps.info.id === id)?.info.price ?? 0) / 100}
                                    </span>
                                    <Button size="sm" className="ml-auto w-24 hover:cursor-pointer" variant="destructive" onClick={() => handleRemoveProduct(id)}>
                                        Remover
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => {
                            setEditingPromotion(undefined)
                            setIsDialogOpen(false)
                        }}>
                            Cancelar
                        </Button>

                        <Button type="submit" className="gradient-primary text-white">
                            {editingPromotion ? "Salvar Alterações" : "Cadastrar Promoção"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    )
}
