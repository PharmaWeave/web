"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

type UserRole = "admin" | "gerente" | "funcionario"

export function LoginForm() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("gerente")
  const [cpf, setCpf] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple role-based routing
    switch (selectedRole) {
      case "admin":
        router.push("/admin/dashboard")
        break
      case "gerente":
        router.push("/manager/dashboard")
        break
      case "funcionario":
        router.push("/employee/dashboard")
        break
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
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
        <div className="flex gap-2 justify-center">
          {(["admin", "gerente", "funcionario"] as UserRole[]).map((role) => (
            <Badge
              key={role}
              variant={selectedRole === role ? "default" : "secondary"}
              className={`cursor-pointer px-4 py-2 ${
                selectedRole === role
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
              onClick={() => setSelectedRole(role)}
            >
              {role === "admin" ? "Admin" : role === "gerente" ? "Gerente" : "Funcionário"}
            </Badge>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              maxLength={14}
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
            Entrar como {selectedRole === "admin" ? "Admin" : selectedRole === "gerente" ? "Gerente" : "Funcionário"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
