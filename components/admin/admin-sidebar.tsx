"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  LayoutDashboard,
  Calendar,
  Lightbulb,
  Users,
  Bell,
  UserPlus,
  UsersRound,
  DollarSign,
  Settings,
  Home,
} from "lucide-react"
import type { Admin } from "@/lib/types"

interface AdminSidebarProps {
  admin: Admin
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/offerings", label: "What We Offer", icon: Lightbulb },
  { href: "/admin/staff", label: "Staff Directory", icon: Users },
  { href: "/admin/announcements", label: "Announcements", icon: Bell },
  { href: "/admin/register-student", label: "Register Student", icon: UserPlus },
  { href: "/admin/students", label: "View Students", icon: UsersRound },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

const financeItem = { href: "/admin/finance", label: "Finance", icon: DollarSign }

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname()
  const canAccessFinance = admin.role === "president" || admin.role === "financial_officer"

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r bg-card lg:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm">Compssa Department</span>
          <span className="text-xs text-muted-foreground">Admin Portal</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn("w-full justify-start gap-3", isActive && "bg-primary/10 text-primary")}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              </li>
            )
          })}

          {canAccessFinance && (
            <li>
              <Link href={financeItem.href}>
                <Button
                  variant={pathname === financeItem.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    pathname === financeItem.href && "bg-primary/10 text-primary",
                  )}
                >
                  <financeItem.icon className="h-4 w-4" />
                  {financeItem.label}
                </Button>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="border-t p-4">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
            <Home className="h-4 w-4" />
            Back to Website
          </Button>
        </Link>
      </div>
    </aside>
  )
}
