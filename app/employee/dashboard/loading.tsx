import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <DashboardLayout userRole="employee" userName="Usuário">
      <div className="p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="h-8 bg-secondary/50 rounded-lg w-64 animate-pulse" />
          <div className="h-4 bg-secondary/50 rounded-lg w-48 animate-pulse" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-secondary/50 rounded w-24 animate-pulse" />
                  <div className="h-8 bg-secondary/50 rounded w-16 animate-pulse" />
                  <div className="h-3 bg-secondary/50 rounded w-20 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="gradient-card border-border/50">
              <CardHeader>
                <div className="h-6 bg-secondary/50 rounded w-48 animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                    <div className="w-2 h-2 bg-secondary/50 rounded-full mt-2 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-secondary/50 rounded w-full animate-pulse" />
                      <div className="h-3 bg-secondary/50 rounded w-20 animate-pulse" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
