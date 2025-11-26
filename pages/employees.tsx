"use client"

import type React from "react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/ui/stat-card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Users, Plus, Search, Mail, Edit, Power } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { StatusEnum, StatusType } from "@/@types/status"
import { RoleEnum, RoleType } from "@/@types/role"
import ApiService, { ApiResponse } from "@/services/api"
import URLS from "@/services/urls"
import useAuth from "@/hooks/use-auth"
import { formatCPF } from "@/utils/cpf"
import normalize from "@/utils/nomalize"
import { cn } from "@/lib/utils"
import ComboBox from "@/components/combobox"
import { Branch } from "@/app/admin/units/page"
import Toast from "@/utils/toast"

export interface Employee {
    id: number;
    name: string;
    email: string;
    role: RoleType;
    register: string;
    salary: number;
    branch: {
        id: number;
        name: string;
    }

    createdAt: Date;
    updatedAt: Date;
    status: StatusType;
}

export default function EmployeesPage() {
    const { auth } = useAuth()

    const [showActiveOnly, setShowActiveOnly] = useState(false)
    const [search, setSearch] = useState("")

    const defaultForm = {
        name: "",
        register: "",
        email: "",
        salary: "",
        branch_id: 0
    }

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState(defaultForm)
    const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>()

    const [employees, setEmployees] = useState<Employee[]>([])
    const [branches, setBranches] = useState<Branch[]>([])

    const fetchEmployees = () => {
        ApiService.get(URLS.USER.EMPLOYEE.LIST, {}, auth?.access_token).then((data: ApiResponse<Employee[]>) => setEmployees(data.data));
    }

    useEffect(() => {
        fetchEmployees()

        if (auth && auth.role === RoleEnum.ADMIN) {
            ApiService.get(URLS.BRANCH.LIST, {}, auth.access_token)
                .then((data: ApiResponse<Branch[]>) => {
                    setBranches(data.data.filter(p => p.status === StatusEnum.ACTIVE))
                })
        }
    }, [auth]);

    useEffect(() => {
        if (editingEmployee) {
            setFormData({
                name: editingEmployee.name,
                register: editingEmployee.register,
                email: editingEmployee.email,
                salary: formatSalary(editingEmployee.salary.toString()),
                branch_id: editingEmployee.branch.id
            })
        } else {
            setFormData(defaultForm)
        }
    }, [editingEmployee, isDialogOpen])

    const isEmployeeActive = (employee: Employee) => {
        return employee.status === StatusEnum.ACTIVE;
    }

    const filteredEmployees = useMemo(() => {
        let current = employees;

        if (showActiveOnly) {
            current = current.filter((employee) => isEmployeeActive(employee));
        }

        if (search.trim().length > 0) {
            const s = normalize(search.toLowerCase());

            current = current.filter((employee) =>
                normalize(employee.name.toLowerCase()).includes(s)
                || (employee.email && normalize(employee.email.toLowerCase()).includes(s))
                || employee.register.includes(s)
                || formatCPF(employee.register).includes(s)
            );
        }

        return current;
    }, [showActiveOnly, search, employees]);

    const handleToggleStatus = (employeeId: number) => {
        ApiService.patch(URLS.USER.EMPLOYEE.STATUS(employeeId), {}, auth?.access_token)
            .then((data: ApiResponse<Employee>) => {
                fetchEmployees()

                Toast.success(`Funcionário ${data.data.status === StatusEnum.ACTIVE ? "ativado" : "desativado"}`)
            })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const salary = Number(formData.salary.replace(/\./g, "").replace(/\,/g, ""))
        const register = formData.register.replace(/\./g, "").replace(/\-/g, "")

        const body = {
            name: formData.name,
            register: register,
            email: formData.email,
            salary: salary,
            branch_id: auth?.role === RoleEnum.ADMIN ? formData.branch_id : auth?.branch_id
        }

        const api = editingEmployee
            ? ApiService.patch(URLS.USER.EMPLOYEE.UPDATE(editingEmployee.id), body, auth?.access_token)
            : ApiService.post(URLS.USER.EMPLOYEE.POST, body, auth?.access_token)


        api.then((data: ApiResponse<Employee>) => {
            fetchEmployees()

            setIsDialogOpen(false)
            setFormData(defaultForm)

            if (editingEmployee) Toast.success("Funcionário atualizado")
            else Toast.success("Funcionário cadastrado. Um email será enviado para o mesmo cadastrar sua senha!")
        })
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const formatSalary = (value: string) => {
        const onlyNumbers = value.replace(/\D/g, "");
        if (!onlyNumbers) return "0,00";

        const normalized = onlyNumbers.padStart(3, "0");
        let integer = normalized.slice(0, -2);
        const decimal = normalized.slice(-2);
        integer = integer.replace(/^0+(?!$)/, "");

        const formattedInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return `${formattedInt},${decimal}`;
    };

    const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatSalary(e.target.value);
        setFormData(prev => ({ ...prev, salary: formatted }));
    };

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Funcionários</h1>
                        <p className="text-muted-foreground">Gerencie os funcionários da farmácia</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gradient-primary text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Novo Funcionário
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Novo Funcionário</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            placeholder="Nome completo"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="register">CPF</Label>
                                        <Input
                                            id="register"
                                            value={formatCPF(formData.register)}
                                            maxLength={14}
                                            onChange={(e) => handleInputChange("register", e.target.value)}
                                            placeholder="000.000.000-00"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        placeholder="funcionario@pharmaweave.com"
                                        required
                                    />
                                </div>
                                <div className={cn(
                                    "grid gap-4",
                                    auth?.role === RoleEnum.ADMIN ? "grid-cols-2" : "grid-cols-1"
                                )}>
                                    <div className="space-y-2">
                                        <Label htmlFor="salary">Salário (R$)</Label>
                                        <Input
                                            id="salary"
                                            value={formData.salary}
                                            onChange={handleSalaryChange}
                                            placeholder="0,00"
                                            required
                                        />
                                    </div>
                                    {auth && auth.role === RoleEnum.ADMIN && (
                                        <div className="space-y-2">
                                            <ComboBox
                                                label="Unidade"
                                                items={branches}
                                                displayKeys={["name"]}
                                                valueKey="id"
                                                value={formData.branch_id}
                                                placeholder="Selecione a unidade..."
                                                onChange={(v) =>
                                                    setFormData(prev => ({ ...prev, branch_id: v }))
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" className="gradient-primary text-white">
                                        {editingEmployee ? "Salvar Alterações" : "Cadastrar Funcionário"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard title="Total de Funcionários" value={employees.length} icon={Users} />
                    <StatCard title="Funcionários Ativos" value={employees.filter(emp => isEmployeeActive(emp)).length} icon={Users} />
                </div>

                <Card className="gradient-card border-border/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar funcionários por nome, email ou CPF..."
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {filteredEmployees.map((employee) => (
                        <Card
                            key={employee.id}
                            className={`gradient-card border-border/50 ${employee.status === StatusEnum.INACTIVE ? "opacity-60" : ""}`}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{employee.name}</CardTitle>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="w-8 h-8 p-0"
                                            onClick={() => {
                                                setEditingEmployee(employee)
                                                setIsDialogOpen(true)
                                            }}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="w-8 h-8 p-0"
                                            onClick={() => handleToggleStatus(employee.id)}
                                        >
                                            <Power
                                                className={`w-4 h-4 ${employee.status === StatusEnum.ACTIVE ? "text-red-500" : "text-green-500"}`}
                                            />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-foreground">{employee.email}</span>
                                    </div>
                                    {auth && auth.role === RoleEnum.ADMIN && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Unidade:</span>
                                            <span className="text-sm font-medium text-foreground">{employee.branch.name}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">CPF:</span>
                                        <span className="text-sm font-medium text-foreground">{formatCPF(employee.register)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Salário:</span>
                                        <span className="text-sm font-medium text-green-500">R$ {(employee.salary / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Status:</span>
                                        <Badge variant={employee.status === StatusEnum.ACTIVE ? "default" : "secondary"} className="text-xs">
                                            {employee.status === StatusEnum.ACTIVE ? "Ativo" : "Inativo"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}
