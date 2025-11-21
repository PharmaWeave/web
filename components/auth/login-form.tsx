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

export function LoginForm() {
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

  const formatCPFOrCNPJForDisplay = (value: string) => {
    const numbers = value.replace(/\D/g, "")

    if (numbers.length <= 11) {
      const part1 = numbers.slice(0, 3)
      const part2 = numbers.slice(3, 6)
      const part3 = numbers.slice(6, 9)
      const part4 = numbers.slice(9, 11)

      let formatted = part1
      if (part2) formatted += "." + part2
      if (part3) formatted += "." + part3
      if (part4) formatted += "-" + part4

      return formatted
    } else {
      const part1 = numbers.slice(0, 2)
      const part2 = numbers.slice(2, 5)
      const part3 = numbers.slice(5, 8)
      const part4 = numbers.slice(8, 12)
      const part5 = numbers.slice(12, 14)

      let formatted = part1
      if (part2) formatted += "." + part2
      if (part3) formatted += "." + part3
      if (part4) formatted += "/" + part4
      if (part5) formatted += "-" + part5

      return formatted
    }
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
              value={formatCPFOrCNPJForDisplay(register)}
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
      </CardContent>
    </Card>
  )
}
