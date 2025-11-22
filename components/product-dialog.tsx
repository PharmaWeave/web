"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import React, { useState } from "react";
import { useEffect } from "react"
import { Product } from "@/pages/products"

export interface ProductForm {
    name: string;
    description: string;
    price: string;
    stock: string;
}

interface ProductDialogProps {
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;

    handleSubmit: (e: React.FormEvent, form: ProductForm, editingProduct?: Product) => void;

    setEditingProduct: React.Dispatch<React.SetStateAction<Product | undefined>>;
    editingProduct?: Product;
}

export default function ProductDialog({
    isDialogOpen,
    setIsDialogOpen,
    handleSubmit,
    setEditingProduct,
    editingProduct
}: ProductDialogProps) {
    const defaultForm = {
        name: "",
        description: "",
        price: "",
        stock: ""
    }

    const [formData, setFormData] = useState<ProductForm>(defaultForm)

    useEffect(() => {
        if (editingProduct) {
            setFormData({
                name: editingProduct.name,
                description: editingProduct.description || "",
                price: (editingProduct.info.price / 100).toFixed(2).replace(".", ","),
                stock: String(editingProduct.info.stock)
            })
        } else {
            setFormData(defaultForm)
        }
    }, [editingProduct, isDialogOpen])

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const formatPrice = (value: string) => {
        const onlyNumbers = value.replace(/\D/g, "");
        if (!onlyNumbers) return "0,00";

        const normalized = onlyNumbers.padStart(3, "0");
        let integer = normalized.slice(0, -2);
        const decimal = normalized.slice(-2);
        integer = integer.replace(/^0+(?!$)/, "");

        const formattedInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return `${formattedInt},${decimal}`;
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPrice(e.target.value);
        setFormData(prev => ({ ...prev, price: formatted }));
    };

    const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const onlyNumbers = e.target.value.replace(/\D/g, "");
        setFormData(prev => ({ ...prev, stock: onlyNumbers }));
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setEditingProduct(undefined)
            setIsDialogOpen(open)
        }}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        handleSubmit(e, formData, editingProduct);
                        setFormData(defaultForm);
                    }}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Nome do produto"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                maxLength={64}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder="Dor de cabeça"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Preço (R$)</Label>
                        <Input
                            id="price"
                            value={formData.price}
                            onChange={handlePriceChange}
                            placeholder="0,00"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stock">Estoque (Quantidade)</Label>
                        <Input
                            id="stock"
                            value={formData.stock}
                            onChange={handleStockChange}
                            placeholder="10"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => {
                            setEditingProduct(undefined)
                            setIsDialogOpen(false)
                        }}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="gradient-primary text-white">
                            {editingProduct ? "Salvar Alterações" : "Cadastrar Produto"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
