"use client"

import React, { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { Club } from "@/lib/types"

interface ClubsManagerProps {
  initialClubs: Club[]
}

export function ClubsManager({ initialClubs }: ClubsManagerProps) {
  const [clubs, setClubs] = useState<Club[]>(initialClubs)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editing, setEditing] = useState<Club | null>(null)
  const [formData, setFormData] = useState({ title: "", description: "", links: "", display_order: 0 })

  const resetForm = () => {
    setFormData({ title: "", description: "", links: "", display_order: clubs.length + 1 })
    setEditing(null)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) resetForm()
  }

  const handleEdit = (club: Club) => {
    setEditing(club)
    setFormData({ title: club.title, description: club.description || "", links: (club.links || []).join("\n"), display_order: club.display_order })
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const supabase = createClient()

    const linksArray = formData.links
      .split(/\r?\n|,/) // allow newline or comma separated
      .map((s) => s.trim())
      .filter(Boolean)

    try {
      if (editing) {
        const { error } = await supabase
          .from("clubs")
          .update({ title: formData.title, description: formData.description, links: linksArray, display_order: formData.display_order, updated_at: new Date().toISOString() })
          .eq("id", editing.id)

        if (error) throw error

        setClubs(clubs.map((c) => (c.id === editing.id ? { ...c, title: formData.title, description: formData.description, links: linksArray, display_order: formData.display_order } : c)))
      } else {
        const { data, error } = await supabase
          .from("clubs")
          .insert({ title: formData.title, description: formData.description, links: linksArray, display_order: formData.display_order })
          .select()
          .single()

        if (error) throw error

        setClubs([...clubs, data])
      }

      setIsOpen(false)
      resetForm()
    } catch (err) {
      console.error("Error saving club", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this club?")) return
    const supabase = createClient()
    const { error } = await supabase.from("clubs").delete().eq("id", id)
    if (!error) setClubs(clubs.filter((c) => c.id !== id))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Clubs ({clubs.length})</CardTitle>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Club
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Club" : "Add New Club"}</DialogTitle>
              <DialogDescription>{editing ? "Update the club details" : "Provide details for the new club"}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="links">Links (one per line or comma separated)</Label>
                  <Textarea id="links" value={formData.links} onChange={(e) => setFormData({ ...formData, links: e.target.value })} rows={3} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input id="display_order" type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value || "0") })} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : editing ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {clubs.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clubs.map((club) => (
                  <TableRow key={club.id}>
                    <TableCell className="font-medium">{club.title}</TableCell>
                    <TableCell className="max-w-xs">
                      <span className="line-clamp-2 text-sm text-muted-foreground">{club.description}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {(club.links || []).slice(0, 3).map((l, i) => (
                          <a key={i} href={l} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline break-words">
                            {l}
                          </a>
                        ))}
                        {club.links && club.links.length > 3 && <span className="text-xs text-muted-foreground">+{club.links.length - 3} more</span>}
                      </div>
                    </TableCell>
                    <TableCell>{club.display_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(club)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(club.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">No clubs yet. Click "Add Club" to create one.</div>
        )}
      </CardContent>
    </Card>
  )
}

export default ClubsManager
