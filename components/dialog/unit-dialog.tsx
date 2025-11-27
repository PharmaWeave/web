"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import React, { useState, useEffect } from "react"
import { Branch } from "@/app/admin/units/page"

export interface BranchForm {
    name: string;
    address: {
        country: string;
        province: string;
        city: string;
        description: string;
        number: number;
    };
    phone: string;
}

interface BranchDialogProps {
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;

    handleSubmit: (e: React.FormEvent, form: BranchForm, editingBranch?: Branch) => Promise<boolean>;

    setEditingBranch: React.Dispatch<React.SetStateAction<Branch | undefined>>;
    editingBranch?: Branch;
}

export default function BranchDialog({
    isDialogOpen,
    setIsDialogOpen,
    handleSubmit,
    setEditingBranch,
    editingBranch
}: BranchDialogProps) {
    const defaultForm: BranchForm = {
        name: "",
        address: {
            country: "",
            province: "",
            city: "",
            description: "",
            number: 0
        },
        phone: ""
    }

    const [formData, setFormData] = useState<BranchForm>(defaultForm)

    useEffect(() => {
        if (editingBranch) {
            setFormData({
                name: editingBranch.name,
                address: {
                    country: editingBranch.address.country,
                    province: editingBranch.address.province,
                    city: editingBranch.address.city,
                    description: editingBranch.address.description,
                    number: editingBranch.address.number,
                },
                phone: editingBranch.phone
            })
        } else {
            setFormData(defaultForm)
        }
    }, [editingBranch, isDialogOpen])

    const handleInputChange = (path: string, value: any) => {
        setFormData(prev => {
            const keys = path.split(".");
            const newData: any = { ...prev };
            let obj = newData;

            for (let i = 0; i < keys.length - 1; i++) {
                obj[keys[i]] = { ...obj[keys[i]] };
                obj = obj[keys[i]];
            }

            obj[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setEditingBranch(undefined)
            setIsDialogOpen(open)
        }}>
            <DialogContent className="max-w-[75vw] max-h-[75vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingBranch ? "Editar Promoção" : "Nova Promoção"}</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={async e => {
                        if (await handleSubmit(e, formData)) setFormData(defaultForm)
                    }}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome da Unidade</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Ex: Farmácia Centro"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                placeholder="+5561999999999"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="country">País</Label>
                            <Input
                                id="country"
                                value={formData.address.country}
                                onChange={(e) => handleInputChange("address.country", e.target.value)}
                                placeholder="Brasil"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="province">Estado</Label>
                            <Input
                                id="province"
                                value={formData.address.province}
                                onChange={(e) => handleInputChange("address.province", e.target.value)}
                                placeholder="São Paulo"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                            id="city"
                            value={formData.address.city}
                            onChange={(e) => handleInputChange("address.city", e.target.value)}
                            placeholder="São Paulo"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="address">Endereço (Rua + Bairro)</Label>
                            <Input
                                id="address"
                                value={formData.address.description}
                                onChange={(e) => handleInputChange("address.description", e.target.value)}
                                placeholder="Rua das Flores, Centro"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="number">Número</Label>
                            <Input
                                id="number"
                                type="number"
                                value={formData.address.number}
                                onChange={(e) => handleInputChange("address.number", e.target.value)}
                                placeholder="123"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => {
                            setEditingBranch(undefined)
                            setIsDialogOpen(false)
                        }}>
                            Cancelar
                        </Button>

                        <Button type="submit" className="gradient-primary text-white">
                            {editingBranch ? "Salvar Alterações" : "Cadastrar Unidade"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
