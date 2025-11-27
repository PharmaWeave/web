"use client"

import useAuth from "@/hooks/use-auth"

export default function AuthGuard({ children }: { children?: React.ReactNode }) {
    const { isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="text-lg font-semibold">Carregando...</span>
            </div>
        )
    }

    return <>{children}</>
}
