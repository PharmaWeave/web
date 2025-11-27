"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"
import ApiService from "@/services/api"
import URLS from "@/services/urls"
import { useRouter } from "next/navigation"
import Toast from "@/utils/toast"

export default function ActivateEmployeePage() {
    const params = useSearchParams()
    const router = useRouter()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const passwordsMatch = useMemo(() => password === confirmPassword, [password, confirmPassword])
    const passwordValid = useMemo(() => password.length >= 6, [password])
    const canSubmit = passwordsMatch && passwordValid

    const handleSubmit = () => {
        if (!canSubmit) return

        ApiService.patch(URLS.USER.EMPLOYEE.ACTIVATE(params?.get("token")), {
            password: password
        }).then(() => {
            router.push("/")

            Toast.success("Senha registrada. Faça seu Login!")
        })
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="gradient-card border-border/50 shadow-2xl">
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary-foreground">PW</span>
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold">PharmaWeave</CardTitle>
                            <CardDescription className="text-muted-foreground">Cadastre sua Senha</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-input border-border text-foreground"
                            />
                            {!passwordValid && password.length > 0 && (
                                <span className="text-sm text-red-500">A senha deve ter no mínimo 6 caracteres.</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmar Senha</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-input border-border text-foreground"
                            />
                            {confirmPassword.length > 0 && !passwordsMatch && (
                                <span className="text-sm text-red-500">As senhas não são iguais.</span>
                            )}
                        </div>

                        <Button
                            variant="default"
                            size="lg"
                            className="w-full"
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                        >
                            Confirmar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
