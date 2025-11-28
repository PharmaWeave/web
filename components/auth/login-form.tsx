"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ApiService from "@/services/api"
import URLS from "@/services/urls"
import useAuth from "@/hooks/use-auth"
import { formatCPFOrCNPJ } from "@/utils/cpf"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const router = useRouter()

  const { setAuth } = useAuth();

  const [register, setRegister] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    ApiService.post(URLS.AUTH.LOGIN, {
      register: register,
      password: password
    }).then((data: { data: { access_token: string; } }) => setAuth(data.data.access_token));
  }

  return (
    <Card className="gradient-card border-border/50 shadow-2xl">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-foreground">PW</span>
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">PharmaWeave</CardTitle>
          <CardDescription className="text-muted-foreground">Sistema de Gerenciamento de Franquias</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register">CPF/CNPJ</Label>
            <Input
              id="register"
              type="text"
              value={formatCPFOrCNPJ(register)}
              onChange={(e) => setRegister(e.target.value.replace(/\D/g, ""))}
              maxLength={18}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>

          <Button type="submit" variant="default" size="lg" className="w-full">
            Entrar
          </Button>
        </form>

        <Label
          className="flex justify-center items-center hover:cursor-pointer"
          onClick={() => router.push("/signup")}
        >
          Não tem conta? Cadastre-se!
        </Label>
      </CardContent>
    </Card>
  )
}
