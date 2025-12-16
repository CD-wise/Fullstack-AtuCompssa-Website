import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FinanceManager } from "@/components/admin/finance-manager"

export default async function FinancePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Get admin profile
  const { data: admin } = await supabase.from("admins").select("*").eq("id", user.id).single()

  // Check if user has finance access
  const canAccessFinance = admin?.role === "president" || admin?.role === "financial_officer"

  if (!canAccessFinance) {
    redirect("/admin")
  }

  // Fetch all data in parallel
  const [studentsRes, financeRes] = await Promise.all([
    supabase.from("students").select("*").order("created_at", { ascending: false }),
    supabase.from("finance").select("*").order("transaction_date", { ascending: false }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
        <p className="text-muted-foreground">View student payments and manage financial transactions</p>
      </div>
      <FinanceManager
        initialStudents={studentsRes.data || []}
        initialTransactions={financeRes.data || []}
        adminId={user.id}
        adminEmail={admin?.email || user.email || ""}
      />
    </div>
  )
}
