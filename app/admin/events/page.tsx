import { createClient } from "@/lib/supabase/server"
import { EventsManager } from "@/components/admin/events-manager"

export default async function EventsPage() {
  const supabase = await createClient()

  const { data: events } = await supabase.from("events").select("*").order("event_date", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events Management</h1>
        <p className="text-muted-foreground">Create, edit, and manage department events</p>
      </div>
      <EventsManager initialEvents={events || []} />
    </div>
  )
}
