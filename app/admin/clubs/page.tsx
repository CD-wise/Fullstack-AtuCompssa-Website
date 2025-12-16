import { createClient } from "@/lib/supabase/server"
import { ClubsManager } from "@/components/admin/clubs-manager"

export default async function ClubsPage() {
  const supabase = await createClient()

  const { data: clubs } = await supabase.from("clubs").select("*").order("display_order")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clubs & Channels</h1>
        <p className="text-muted-foreground">Manage student clubs, channel links and join information</p>
      </div>
      <ClubsManager initialClubs={clubs || []} />
    </div>
  )
}
