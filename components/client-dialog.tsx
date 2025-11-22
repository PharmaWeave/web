"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import React, { useState } from "react";
import { useEffect } from "react"
import { Customer } from "@/pages/clients"
import CPFInput from "./cpf-input"

export interface ClientForm {
    register: string;
    name: string;
    email?: string;
}

interface ClientDialogProps {
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;

    handleSubmit: (e: React.FormEvent, form: ClientForm) => Promise<boolean>;

    setEditingClient: React.Dispatch<React.SetStateAction<Customer | undefined>>;
    editingClient?: Customer;
}

export default function ClientDialog({
    isDialogOpen,
    setIsDialogOpen,
    handleSubmit,
    setEditingClient,
    editingClient
}: ClientDialogProps) {
    const defaultForm = {
        register: "",
        name: "",
        email: undefined
    }

    const [formData, setFormData] = useState<ClientForm>(defaultForm)

    useEffect(() => {
        if (editingClient) {
            setFormData({
                register: editingClient.user_register,
                name: editingClient.user_name,
                email: editingClient.user_email ?? undefined
            })
        } else {
            setFormData(defaultForm)
        }
    }, [editingClient, isDialogOpen])

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setEditingClient(undefined)
            setIsDialogOpen(open)
        }}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{editingClient ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={async (e) => {
                        if (await handleSubmit(e, formData)) setFormData(defaultForm)
                    }}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">CPF</Label>
                            <CPFInput
                                form={formData}
                                setForm={setFormData}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                maxLength={64}
                                placeholder="Mateus Vieira"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Email</Label>
                        <Input
                            id="price"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="exemplo@email.com"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => {
                            setEditingClient(undefined)
                            setIsDialogOpen(false)
                        }}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="gradient-primary text-white">
                            {editingClient ? "Salvar Alterações" : "Cadastrar Cliente"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
