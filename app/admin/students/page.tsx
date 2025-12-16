import { createClient } from "@/lib/supabase/server"
import { StudentsView } from "@/components/admin/students-view"

export default async function StudentsPage() {
  const supabase = await createClient()

  const { data: students } = await supabase.from("students").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">View Students</h1>
        <p className="text-muted-foreground">View and manage all registered students</p>
      </div>
      <StudentsView initialStudents={students || []} />
    </div>
  )
}
