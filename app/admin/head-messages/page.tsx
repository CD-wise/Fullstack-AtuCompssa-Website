import { createClient } from "@/lib/supabase/server"
import { HeadMessagesManager } from "@/components/admin/head-messages-manager"

export default async function HeadMessagesPage() {
  const supabase = await createClient()

  const { data: headMessages } = await supabase
    .from("head_messages")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Head Messages</h1>
        <p className="text-muted-foreground">Manage Head of Department and Faculty Dean messages</p>
      </div>

      <HeadMessagesManager initialMessages={headMessages || []} />
    </div>
  )
}
