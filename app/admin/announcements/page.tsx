import { createClient } from "@/lib/supabase/server"
import { AnnouncementsManager } from "@/components/admin/announcements-manager"

export default async function AnnouncementsPage() {
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground">Create and manage department announcements</p>
      </div>
      <AnnouncementsManager initialAnnouncements={announcements || []} />
    </div>
  )
}
