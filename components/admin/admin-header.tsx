"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  User,
  LogOut,
  LayoutDashboard,
  Calendar,
  Lightbulb,
  Users,
  Bell,
  UserPlus,
  UsersRound,
  DollarSign,
  Home,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"
import type { Admin } from "@/lib/types"

interface AdminHeaderProps {
  admin: Admin
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/offerings", label: "Offerings", icon: Lightbulb },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/announcements", label: "Announcements", icon: Bell },
  { href: "/admin/register-student", label: "Register", icon: UserPlus },
  { href: "/admin/students", label: "Students", icon: UsersRound },
]

const financeItem = { href: "/admin/finance", label: "Finance", icon: DollarSign }

export function AdminHeader({ admin }: AdminHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const canAccessFinance = admin.role === "president" || admin.role === "financial_officer"

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-6">
      {/* Mobile Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-transparent">
                <Logo size={80} />
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
                    <Link href={item.href} onClick={() => setIsOpen(false)}>
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
                  <Link href={financeItem.href} onClick={() => setIsOpen(false)}>
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
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                <Home className="h-4 w-4" />
                Back to Website
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium">{admin.name}</span>
              <Badge variant="secondary" className="text-xs capitalize">
                {admin.role.replace("_", " ")}
              </Badge>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{admin.name}</span>
              <span className="text-xs font-normal text-muted-foreground">{admin.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
