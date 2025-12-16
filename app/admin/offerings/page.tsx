import { createClient } from "@/lib/supabase/server"
import { OfferingsManager } from "@/components/admin/offerings-manager"

export default async function OfferingsPage() {
  const supabase = await createClient()

  const { data: offerings } = await supabase.from("department_offerings").select("*").order("display_order")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">What We Offer</h1>
        <p className="text-muted-foreground">Manage department programs and offerings</p>
      </div>
      <OfferingsManager initialOfferings={offerings || []} />
    </div>
  )
}
