"use client"

import React, { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function VotingToggle() {
  const supabase = createClient()
  const [enabled, setEnabled] = useState(false)
  const [url, setUrl] = useState("https://cs-voting.vercel.app/")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["voting_enabled", "voting_url"])
        if (!mounted) return
        if (data) {
          const map = Object.fromEntries(data.map((r: any) => [r.key, r.value]))
          setEnabled(map["voting_enabled"] === "true")
          if (map["voting_url"]) setUrl(map["voting_url"])
        }
      } catch (e) {
        console.error("Failed to load settings", e)
      }
    })()

    return () => {
      mounted = false
    }
  }, [supabase])

  const save = async () => {
    setLoading(true)
    try {
      // Upsert voting_enabled
      const { error: err1 } = await supabase
        .from("site_settings")
        .upsert({ key: "voting_enabled", value: enabled ? "true" : "false" })
      if (err1) throw err1

      // Upsert voting_url
      const { error: err2 } = await supabase.from("site_settings").upsert({ key: "voting_url", value: url })
      if (err2) throw err2

      // Refresh client (if desired)
      location.reload()
    } catch (e) {
      console.error("Failed to save settings", e)
      alert("Failed to save settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 card-glow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">Voting System</h3>
          <p className="text-sm text-muted-foreground">Toggle visibility of the student voting button on the landing page.</p>
        </div>
        <div className="flex items-center gap-4">
          <Switch checked={enabled} onCheckedChange={(v) => setEnabled(Boolean(v))} />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-foreground">Voting URL</label>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} />

        <div className="flex justify-end mt-3">
          <Button onClick={save} disabled={loading} className="btn-tech">
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
