"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Edit, Power, Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { StatusEnum, StatusType } from "@/@types/status"
import ApiService, { ApiResponse } from "@/services/api"
import URLS from "@/services/urls"
import { formatCPF } from "@/utils/cpf"
import normalize from "@/utils/nomalize"
import useAuth from "@/hooks/use-auth"
import ClientDialog, { ClientForm } from "@/components/client-dialog"
import Toast from "@/utils/toast"
import { RoleEnum, RoleType } from "@/@types/role"

export interface Customer {
    user_id: number;
    user_name: string;
    user_register: string;
    user_role: RoleType;
    user_email?: string;

    total_spent: number;
    total_purchases: number;
    last_purchase: number;

    user_status: StatusType;
}

interface CustomerStatus {
    status: StatusType
}

export default function ClientsPage() {
    const { auth } = useAuth();

    const [editingClient, setEditingClient] = useState<Customer | undefined>()

    const [showActiveOnly, setShowActiveOnly] = useState(true)
    const [search, setSearch] = useState("")

    const [clients, setClients] = useState<Customer[]>([])

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = () => {
        ApiService.get(URLS.SALE.USER.METRICS, {}, auth?.access_token).then((data: ApiResponse<Customer[]>) => setClients(data.data))
    }

    const isCustomerActive = (customer: Customer) => { return customer.user_status === StatusEnum.ACTIVE; }

    const filteredClients = useMemo(() => {
        let current = clients;

        if (showActiveOnly) {
            current = current.filter((customer) => isCustomerActive(customer));
        }

        if (search.trim().length > 0) {
            const s = normalize(search.toLowerCase());

            current = current.filter((client) =>
                normalize(client.user_name.toLowerCase()).includes(s)
                || client.user_register.includes(s)
                || formatCPF(client.user_register).includes(s)
                || normalize(client.user_email?.toLowerCase() ?? "").includes(s)
            );
        }

        return current;
    }, [showActiveOnly, search, clients]);

    const handleSubmit = async (e: React.FormEvent, form: ClientForm): Promise<boolean> => {
        e.preventDefault()

        const body: ClientForm = {
            register: form.register.replace(/\./g, "").replace(/\-/g, ""),
            name: form.name,
            email: form.email
        }

        try {
            if (editingClient) {
                await ApiService.patch(URLS.USER.CUSTOMER.UPDATE(editingClient.user_id), body, auth?.access_token)
                Toast.success("Cliente atualizado!")
            } else {
                await ApiService.post(URLS.USER.CUSTOMER.POST, body, auth?.access_token)
                Toast.success("Cliente criado!")
            }

            fetchClients()

            setEditingClient(undefined)
            setIsDialogOpen(false)
        } catch (err) {
            return false
        }

        return true
    }

    const handleInactivate = (user_id: number) => {
        ApiService.patch(URLS.USER.CUSTOMER.STATUS(user_id), {}, auth?.access_token)
            .then((data: ApiResponse<CustomerStatus>) => {
                fetchClients()

                Toast.success(`Cliente ${data.data.status === StatusEnum.ACTIVE ? "ativado" : "desativado"}!`)
            })
    }

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
                        <p className="text-muted-foreground">Gerencie os clientes da farmácia</p>
                    </div>
                    <Button className="gradient-primary text-white" onClick={() => setIsDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Cliente
                    </Button>

                    <ClientDialog
                        isDialogOpen={isDialogOpen}
                        setIsDialogOpen={setIsDialogOpen}
                        handleSubmit={handleSubmit}
                        setEditingClient={setEditingClient}
                        editingClient={editingClient}
                    />
                </div>

                <Card className="gradient-card border-border/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar clientes por nome, email ou CPF..."
                                    className="pl-10 bg-input border-border"
                                    onChange={e => setSearch(e.currentTarget.value)}
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

                <Card className="gradient-card border-border/50">
                    <CardHeader>
                        <CardTitle>Lista de Clientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Nome</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Email</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">CPF</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Compras</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Total Gasto</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Última Compra</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.map((client) => (
                                        <tr
                                            key={client.user_id}
                                            className={`border-b border-border/50 hover:bg-secondary/50 ${!isCustomerActive(client) ? "opacity-60" : ""}`}
                                        >
                                            <td className="p-3 text-sm font-medium text-foreground">{client.user_name}</td>
                                            <td className="p-3 text-sm text-foreground">{client.user_email ?? "-"}</td>
                                            <td className="p-3 text-sm text-foreground">{formatCPF(client.user_register)}</td>
                                            <td className="p-3 text-sm text-foreground">{client.total_purchases}</td>
                                            <td className="p-3 text-sm font-medium text-green-500">R$ {(client.total_spent / 100).toFixed(2)}</td>
                                            <td className="p-3 text-sm text-foreground">
                                                {client.last_purchase ? new Date(client.last_purchase).toLocaleString("pt-BR") : "-"}
                                            </td>
                                            <td className="p-3">
                                                <Badge variant={isCustomerActive(client) ? "default" : "secondary"} className="text-xs">
                                                    {isCustomerActive(client) ? "Ativo" : "Inativo"}
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-1">
                                                    {(auth?.role === RoleEnum.EMPLOYEE && client.user_role !== RoleEnum.MANAGER)
                                                        && (
                                                            <Button size="sm" variant="ghost"
                                                                className="w-8 h-8 p-0"
                                                                onClick={() => {
                                                                    setEditingClient(client)
                                                                    setIsDialogOpen(true)
                                                                }}
                                                            >
                                                                <Edit className="w-4 h-4 text-muted-foreground" />
                                                            </Button>
                                                        )}
                                                    {((auth?.role === RoleEnum.EMPLOYEE && client.user_role === RoleEnum.USER)
                                                        || (auth?.role === RoleEnum.MANAGER))
                                                        && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="w-8 h-8 p-0"
                                                                onClick={() => handleInactivate(client.user_id)}
                                                            >
                                                                <Power
                                                                    className={`w-4 h-4 ${isCustomerActive(client) ? "text-red-500" : "text-green-500"}`}
                                                                />
                                                            </Button>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
