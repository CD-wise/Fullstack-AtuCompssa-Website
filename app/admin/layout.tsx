import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import type { Admin } from "@/lib/types"
import FloatingChatButton from "@/components/floating-chat-button"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: adminProfile } = await supabase.from("admins").select("*").eq("id", user.id).maybeSingle()

  let admin: Admin
  if (adminProfile) {
    admin = adminProfile
  } else {
    // Create admin profile if it doesn't exist (for users who signed up before trigger was set up)
    const newAdmin = {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || "Admin",
      role: user.user_metadata?.role || "admin",
    }

    const { data: createdAdmin } = await supabase.from("admins").upsert(newAdmin).select().maybeSingle()

    admin = createdAdmin || {
      ...newAdmin,
      created_at: user.created_at,
    }
  }

  return (
    <div className="min-h-screen flex bg-secondary/30">
      <AdminSidebar admin={admin} />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <AdminHeader admin={admin} />
        <main className="flex-1 p-3 sm:p-6 overflow-auto">{children}</main>
      </div>
      <FloatingChatButton />
    </div>
  )
}
