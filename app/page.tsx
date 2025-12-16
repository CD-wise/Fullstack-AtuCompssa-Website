import { createClient } from "@/lib/supabase/server"
import { HeroSection } from "@/components/hero-section"
import { OfferingsSection } from "@/components/offerings-section"
import { EventsSection } from "@/components/events-section"
import { StaffSection } from "@/components/staff-section"
import { ClubsSection } from "@/components/clubs-section"
import { GallerySection } from "@/components/gallery-section"
import { AnnouncementsSection } from "@/components/announcements-section"
import { CTASection } from "@/components/cta-section"
import { VotingSection } from "@/components/voting-section"
import { Footer } from "@/components/footer"
import FloatingChatButton from "@/components/floating-chat-button"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch all data in parallel
  const [offeringsRes, eventsRes, staffRes, announcementsRes, clubsRes, galleryRes, settingsRes] = await Promise.all([
    supabase.from("department_offerings").select("*").order("display_order"),
    supabase.from("events").select("*").order("event_date", { ascending: true }).limit(6),
    supabase.from("staff").select("*").order("display_order"),
    supabase.from("announcements").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(5),
    // clubs table is optional; if it does not exist the request may error — the component handles empty array
    supabase.from("clubs").select("*").order("display_order"),
    supabase.from("gallery_images").select("*").order("display_order"),
    supabase.from("site_settings").select("key, value").in("key", ["voting_enabled", "voting_url"]),
  ])

  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning>
      <main className="flex-1">
        <HeroSection />
        <OfferingsSection offerings={offeringsRes.data || []} />
        <GallerySection images={galleryRes.data || []} />
        <EventsSection events={eventsRes.data || []} />
        {/* Voting section - controlled via admin settings */}
        <VotingSection
          enabled={Boolean(settingsRes.data?.find((s: any) => s.key === "voting_enabled")?.value === "true")}
          url={settingsRes.data?.find((s: any) => s.key === "voting_url")?.value}
        />
        <ClubsSection clubs={clubsRes?.data || []} />
        <AnnouncementsSection announcements={announcementsRes.data || []} />
        <StaffSection staff={staffRes.data || []} />
        <CTASection />
      </main>
      <Footer />
      <FloatingChatButton />
    </div>
  )
}
