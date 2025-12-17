"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
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
  Mail,
} from "lucide-react"
import type { Admin } from "@/lib/types"

interface AdminSidebarProps {
  admin: Admin
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/announcements", label: "Announcements", icon: Bell },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/offerings", label: "What We Offer", icon: Lightbulb },
  { href: "/admin/staff", label: "Staff Directory", icon: Users },
  { href: "/admin/register-student", label: "Register Student", icon: UserPlus },
  { href: "/admin/students", label: "View Students", icon: UsersRound },
  { href: "/admin/contact-messages", label: "Inbox", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

const financeItem = { href: "/admin/finance", label: "Finance", icon: DollarSign }

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)
  const canAccessFinance = admin.role === "president" || admin.role === "financial_officer"
  const supabase = createClient()

  useEffect(() => {
    // Fetch unread count
    const fetchUnreadCount = async () => {
      try {
        const { count, error } = await supabase
          .from("contact_submissions")
          .select("*", { count: "exact", head: true })
          .eq("is_read", false)

        if (!error) {
          setUnreadCount(count || 0)
        }
      } catch (err) {
        console.error("Error fetching unread count:", err)
      }
    }

    fetchUnreadCount()

    // Subscribe to real-time changes
    const channel = supabase
      .channel("contact_submissions")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contact_submissions",
        },
        () => {
          fetchUnreadCount()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

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
            // Show unread badge for Inbox
            const isInbox = item.href === "/admin/contact-messages"
            const showUnreadBadge = isInbox && unreadCount > 0

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn("w-full justify-start gap-3", isActive && "bg-primary/10 text-primary")}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {showUnreadBadge && (
                      <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {unreadCount}
                      </Badge>
                    )}
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
