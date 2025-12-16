import { createClient } from "@/lib/supabase/server"
import { StaffManager } from "@/components/admin/staff-manager"

export default async function StaffPage() {
  const supabase = await createClient()

  const { data: staff } = await supabase.from("staff").select("*").order("display_order")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Directory</h1>
        <p className="text-muted-foreground">Manage faculty, executives, and staff members</p>
      </div>
      <StaffManager initialStaff={staff || []} />
    </div>
  )
}
