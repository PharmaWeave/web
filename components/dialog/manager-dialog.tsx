"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import React, { useState } from "react";
import { useEffect } from "react"
import { Employee } from "@/pages/employees";
import ApiService, { ApiResponse } from "@/services/api";
import URLS from "@/services/urls";
import useAuth from "@/hooks/use-auth";
import ComboBox from "../ui/combobox";
import { RoleEnum, RoleType } from "@/@types/role";
import { StatusEnum } from "@/@types/status";

export interface ManagerForm {
    employee_id: number;
    role: RoleType;
}

interface ManagerDialogProps {
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;

    handleSubmit: (e: React.FormEvent, form: ManagerForm) => Promise<boolean>;
}

export default function ManagerDialog({
    isDialogOpen,
    setIsDialogOpen,
    handleSubmit
}: ManagerDialogProps) {
    const { auth } = useAuth()

    const defaultForm = {
        employee_id: 0,
        role: RoleEnum.EMPLOYEE
    }

    const [formData, setFormData] = useState<ManagerForm>(defaultForm)
    const [employees, setEmployees] = useState<Employee[]>([])

    useEffect(() => {
        if (isDialogOpen) {
            ApiService.get(URLS.USER.EMPLOYEE.LIST, {}, auth?.access_token)
                .then((data: ApiResponse<Employee[]>) => {
                    setEmployees(data.data.filter(
                        p => p.role === RoleEnum.EMPLOYEE
                            && p.status === StatusEnum.ACTIVE
                    ))
                })
        }

        setFormData(defaultForm)
    }, [isDialogOpen])

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Novo Gerente</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={async (e) => {
                        if (await handleSubmit(e, formData)) setFormData(defaultForm)
                    }}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-1 gap-4">
                        <ComboBox
                            label="Funcionário"
                            items={employees}
                            displayKeys={["name", "register"]}
                            valueKey="id"
                            value={formData.employee_id}
                            placeholder="Selecione um funcionário para promover..."
                            onChange={(v) =>
                                setFormData(prev => ({ ...prev, employee_id: v }))
                            }
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="gradient-primary text-white">
                            Promover Funcionário
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
