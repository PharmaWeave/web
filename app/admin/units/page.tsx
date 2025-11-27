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
import { Textarea } from "@/components/ui/textarea"
import { Building2, DollarSign, Plus, Search, MapPin, Edit, Power } from "lucide-react"
import { useEffect, useState } from "react"
import { StatusEnum, StatusType } from "@/@types/status"
import ApiService, { ApiResponse } from "@/services/api"
import URLS from "@/services/urls"
import useAuth from "@/hooks/use-auth"
import months from "@/utils/months"
import Toast from "@/utils/toast"
import BranchDialog, { BranchForm } from "@/components/dialog/unit-dialog"

export interface Branch {
  id: number;
  name: string;
  phone: string;

  brand: {
    id: number;
    legal_name: string;
  },

  address: {
    id: number;
    country: string;
    province: string;
    city: string;
    description: string;
    number: number;
  },

  managers: Manager[],

  employee_count: number;
  month_revenue: number;

  createdAt: string;
  updatedAt: string;
  status: StatusType;
}

interface Manager {
  id: number;
  name: string;
  email: string;
  register: string;
}

export default function UnitsPage() {
  const { auth } = useAuth()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [showActiveOnly, setShowActiveOnly] = useState(true)

  const [editingBranch, setEditingBranch] = useState<Branch | undefined>()

  const [units, setUnits] = useState<Branch[]>([])

  const fetchBranches = () => {
    ApiService.get(URLS.BRANCH.LIST, {}, auth?.access_token).then((data: { data: Branch[] }) => setUnits(data.data));
  }

  useEffect(() => {
    fetchBranches()
  }, []);

  const filteredUnits = showActiveOnly ? units.filter((unit) => unit.status === StatusEnum.ACTIVE) : units
  const activeUnits = units.filter((unit) => unit.status === StatusEnum.ACTIVE).length

  const getCompleteAddress = (branch: Branch) => {
    return `${branch.address.country}, ${branch.address.province}, ${branch.address.city}; ${branch.address.description}, ${branch.address.number}`
  }

  const handleToggleStatus = (unitId: number) => {
    ApiService.patch(URLS.BRANCH.STATUS(unitId), {}, auth?.access_token)
      .then((data: ApiResponse<Branch>) => {
        fetchBranches()

        Toast.success(`Unidade ${data.data.status === StatusEnum.ACTIVE ? "ativada" : "desativada"}!`)
      })
  }

  const handleSubmit = async (e: React.FormEvent, form: BranchForm): Promise<boolean> => {
    e.preventDefault()

    const body: BranchForm = {
      ...form,
      address: {
        ...form.address,
        number: Number(form.address.number)
      },
      ...(form.phone && form.phone.trim().length > 0 && {
        phone: form.phone.trim()
      })
    }

    const api = editingBranch
      ? ApiService.patch(URLS.BRANCH.UPDATE(editingBranch.id), body, auth?.access_token)
      : ApiService.post(URLS.BRANCH.POST, body, auth?.access_token)

    return api.then(() => {
      fetchBranches()

      Toast.success("Unidade criada!")

      setIsDialogOpen(false)
      return true
    }).catch(() => {
      return false
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col p-6 h-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Unidades</h1>
            <p className="text-muted-foreground">Gerencie as unidades da rede</p>
          </div>
          <Button className="gradient-primary text-white" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Unidade
          </Button>

          <BranchDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleSubmit={handleSubmit}
            setEditingBranch={setEditingBranch}
            editingBranch={editingBranch}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <StatCard title="Unidades Ativas" value={activeUnits.toString()} icon={Building2} />
          <StatCard
            title={`Receita Mensal (${months[new Date().getMonth()]})`}
            value={`R$ ${(units.reduce((p, u) => p + u.month_revenue, 0) / 100).toFixed(2)}`}
            icon={DollarSign}
          />
        </div>

        <Card className="gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar unidades por nome..."
                  className="pl-10 bg-input border-border"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
          {filteredUnits.map((unit) => (
            <Card
              key={unit.id}
              className={`gradient-card border-border/50 ${unit.status === StatusEnum.INACTIVE ? "opacity-60" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{unit.name}</CardTitle>
                    <Badge variant={unit.status === StatusEnum.ACTIVE ? "default" : "secondary"} className="mt-1">
                      {unit.status === StatusEnum.ACTIVE ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0" onClick={() => {
                      setEditingBranch(unit)
                      setIsDialogOpen(true)
                    }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-8 h-8 p-0"
                      onClick={() => handleToggleStatus(unit.id)}
                    >
                      <Power className={`w-4 h-4 ${unit.status === StatusEnum.ACTIVE ? "text-red-500" : "text-green-500"}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{getCompleteAddress(unit)}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col justify-between">
                    <span className="text-sm text-muted-foreground">Gerentes:</span>
                    <ul>
                      {unit.managers.map(manager => (
                        <li key={manager.id} className="text-sm font-medium text-foreground">
                          {manager.name} - ({manager.register})
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Receita Mensal:</span>
                    <span
                      className={`text-sm font-medium ${unit.status === StatusEnum.ACTIVE ? "text-green-500" : "text-gray-400"}`}
                    >
                      R$ {(unit.month_revenue / 100).toFixed(2)}
                    </span>
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
