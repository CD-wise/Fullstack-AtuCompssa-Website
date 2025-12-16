"use client"

import React, { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function SocialSettings() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [twitter, setTwitter] = useState("")
  const [facebook, setFacebook] = useState("")
  const [instagram, setInstagram] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [youtube, setYoutube] = useState("")
  const [github, setGithub] = useState("")
  const [tiktok, setTiktok] = useState("")

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["social_twitter", "social_facebook", "social_instagram", "social_linkedin", "social_youtube", "social_github", "social_tiktok"])
        
        if (!mounted) return
        
        if (data) {
          const map = Object.fromEntries(data.map((r: any) => [r.key, r.value]))
          setTwitter(map["social_twitter"] || "")
          setFacebook(map["social_facebook"] || "")
          setInstagram(map["social_instagram"] || "")
          setLinkedin(map["social_linkedin"] || "")
          setYoutube(map["social_youtube"] || "")
          setGithub(map["social_github"] || "")
          setTiktok(map["social_tiktok"] || "")
        }
      } catch (e) {
        console.error("Failed to load social settings", e)
      }
    })()

    return () => {
      mounted = false
    }
  }, [supabase])

  const save = async () => {
    setLoading(true)
    try {
      const updates = [
        { key: "social_twitter", value: twitter },
        { key: "social_facebook", value: facebook },
        { key: "social_instagram", value: instagram },
        { key: "social_linkedin", value: linkedin },
        { key: "social_youtube", value: youtube },
        { key: "social_github", value: github },
        { key: "social_tiktok", value: tiktok },
      ]

      for (const update of updates) {
        const { error } = await supabase.from("site_settings").upsert(update)
        if (error) throw error
      }

      location.reload()
    } catch (e) {
      console.error("Failed to save social settings", e)
      alert("Failed to save social settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 card-glow">
      <div className="mb-4">
        <h3 className="text-lg font-bold">Social Media Links</h3>
        <p className="text-sm text-muted-foreground">Add URLs for your social media profiles. Leave blank to hide.</p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium text-foreground">Twitter URL</label>
          <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/..." />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Facebook URL</label>
          <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/..." />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Instagram URL</label>
          <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..." />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">LinkedIn URL</label>
          <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/..." />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">YouTube URL</label>
          <Input value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="https://youtube.com/..." />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">GitHub URL</label>
          <Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">TikTok URL</label>
          <Input value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="https://tiktok.com/..." />
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={save} disabled={loading} className="btn-tech">
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
