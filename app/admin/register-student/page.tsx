import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StudentRegistrationForm } from "@/components/admin/student-registration-form"

export default async function RegisterStudentPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Get admin profile
  const { data: admin } = await supabase.from("admins").select("*").eq("id", user.id).single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Register Student</h1>
        <p className="text-muted-foreground">Add a new student to the department database</p>
      </div>
      <StudentRegistrationForm adminId={user.id} adminEmail={admin?.email || user.email || ""} />
    </div>
  )
}
