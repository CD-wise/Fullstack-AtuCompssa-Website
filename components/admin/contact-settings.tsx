"use client"

import React, { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function ContactSettings() {
  const supabase = createClient()
  const [address, setAddress] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await supabase.from("site_settings").select("key, value").in("key", ["contact_address", "contact_email", "contact_phone"])
        if (!mounted) return
        if (data) {
          const map = Object.fromEntries(data.map((r: any) => [r.key, r.value]))
          if (map["contact_address"]) setAddress(map["contact_address"])
          if (map["contact_email"]) setEmail(map["contact_email"])
          if (map["contact_phone"]) setPhone(map["contact_phone"])
        }
      } catch (e) {
        console.error("Failed to load contact settings", e)
      }
    })()

    return () => {
      mounted = false
    }
  }, [supabase])

  const save = async () => {
    setLoading(true)
    try {
      const { error: e1 } = await supabase.from("site_settings").upsert({ key: "contact_address", value: address })
      if (e1) throw e1
      const { error: e2 } = await supabase.from("site_settings").upsert({ key: "contact_email", value: email })
      if (e2) throw e2
      const { error: e3 } = await supabase.from("site_settings").upsert({ key: "contact_phone", value: phone })
      if (e3) throw e3

      location.reload()
    } catch (e) {
      console.error("Failed to save contact settings", e)
      alert("Failed to save contact settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 card-glow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">Contact Information</h3>
          <p className="text-sm text-muted-foreground">Edit the contact details shown on the public site.</p>
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-foreground">Address</label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} />

        <label className="text-sm font-medium text-foreground">Email</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="text-sm font-medium text-foreground">Phone</label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />

        <div className="flex justify-end mt-3">
          <Button onClick={save} disabled={loading} className="btn-tech">
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
