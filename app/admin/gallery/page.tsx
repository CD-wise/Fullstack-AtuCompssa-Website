import { createClient } from "@/lib/supabase/server"
import { GalleryManager } from "@/components/admin/gallery-manager"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Gallery Management - Compssa Department",
  description: "Manage department activity gallery images",
}

export default async function GalleryPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Check admin status
  const { data: admin } = await supabase
    .from("admins")
    .select("id, role")
    .eq("id", session.user.id)
    .single()

  if (!admin) {
    redirect("/")
  }

  // Fetch gallery images
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Gallery</h1>
        <p className="text-muted-foreground mt-2">
          Manage images that appear in the department gallery carousel on the homepage
        </p>
      </div>

      <GalleryManager initialImages={images || []} />
    </div>
  )
}
