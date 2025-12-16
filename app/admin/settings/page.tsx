import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { VotingToggle } from "@/components/admin/voting-toggle"
import { ContactSettings } from "@/components/admin/contact-settings"
import { SocialSettings } from "@/components/admin/social-settings"

export const metadata = {
  title: "Site Settings - Compssa Department",
}

export default async function SettingsPage() {
  const supabase = await createClient()

  // Ensure admin
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect("/auth/login")

  const { data: admin } = await supabase.from("admins").select("id").eq("id", session.user.id).single()
  if (!admin) redirect("/")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground">Configure site-wide settings</p>
      </div>

      {/* Voting toggle client component */}
      <VotingToggle />

      {/* Contact info settings */}
      <ContactSettings />

      {/* Social media links settings */}
      <SocialSettings />
    </div>
  )
}
