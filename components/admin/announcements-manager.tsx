"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Pencil, Trash2, Bell, Image as ImageIcon, X } from "lucide-react"
import type { Announcement } from "@/lib/types"
import Image from "next/image"

interface AnnouncementsManagerProps {
  initialAnnouncements: Announcement[]
}

export function AnnouncementsManager({ initialAnnouncements }: AnnouncementsManagerProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    is_active: true,
  })
  const router = useRouter()

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      is_active: true,
    })
    setEditingAnnouncement(null)
    setImagePreview(null)
    setSelectedFile(null)
  }

  // Resize image file to max dimensions (keeps aspect ratio, doesn't upscale)
  const resizeImageFile = (file: File, maxWidth = 400, maxHeight = 400): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img') as HTMLImageElement
      img.onload = () => {
        const { width: iw, height: ih } = img
        const ratio = Math.min(maxWidth / iw, maxHeight / ih, 1)
        const w = Math.round(iw * ratio)
        const h = Math.round(ih * ratio)
        const canvas = document.createElement("canvas")
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject(new Error("Canvas not supported"))
        ctx.drawImage(img, 0, 0, w, h)
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Failed to create blob from canvas"))
            const resizedFile = new File([blob], file.name, { type: file.type })
            resolve(resizedFile)
          },
          file.type || "image/jpeg",
          0.9
        )
      }
      img.onerror = (err) => reject(err)
      const reader = new FileReader()
      reader.onload = () => {
        img.src = reader.result as string
      }
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) resetForm()
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      is_active: announcement.is_active,
    })
    setImagePreview(announcement.image_url)
    setSelectedFile(null)
    setIsOpen(true)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const resized = await resizeImageFile(file, 400, 400)
        setSelectedFile(resized)
        const reader = new FileReader()
        reader.onloadend = () => setImagePreview(reader.result as string)
        reader.readAsDataURL(resized)
      } catch (err) {
        console.error("Image resize failed, using original file:", err)
        setSelectedFile(file)
        const reader = new FileReader()
        reader.onloadend = () => setImagePreview(reader.result as string)
        reader.readAsDataURL(file)
      }
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const supabase = createClient()

    try {
      let imageUrl = editingAnnouncement?.image_url || null

      // Upload image if selected
      if (selectedFile) {
        const ext = selectedFile.type.split('/')[1] || 'jpg'
        const fileName = `announcement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("announcements")
          .upload(fileName, selectedFile, { upsert: false })

        if (uploadError) {
          // Provide a clearer error when the storage bucket is missing
          const msg = uploadError?.message || String(uploadError)
          if (/bucket not found/i.test(msg)) {
            throw new Error(
              "Storage bucket 'announcements' not found. Create a bucket named 'announcements' in your Supabase project's Storage (can be public) and retry. See https://app.supabase.com -> your project -> Storage"
            )
          }
          throw uploadError
        }

        const { data: urlData } = supabase.storage
          .from("announcements")
          .getPublicUrl(uploadData.path)

        imageUrl = urlData.publicUrl
      }

      if (editingAnnouncement) {
        // Use server API to perform update (server performs DB write with service role)
        const res = await fetch(`/api/admin/announcements/${editingAnnouncement.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, image_url: imageUrl }),
        })

        if (!res.ok) {
          const text = await res.text()
          console.error('Update announcement failed', res.status, text)
          throw new Error(text || "Failed to update announcement")
        }

        const result = await res.json()
        const updated = result.data
        setAnnouncements(announcements.map((a) => (a.id === editingAnnouncement.id ? updated : a)))
      } else {
        const res = await fetch(`/api/admin/announcements`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, image_url: imageUrl }),
        })

        if (!res.ok) {
          const text = await res.text()
          console.error('Create announcement failed', res.status, text)
          throw new Error(text || "Failed to create announcement")
        }

        const result = await res.json()
        setAnnouncements([result.data, ...announcements])
      }

      setIsOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error("Error saving announcement:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return

    // Call server API to delete (server uses service role)
    const res = await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const text = await res.text()
      console.error('Delete failed:', text)
      return
    }
    setAnnouncements(announcements.filter((a) => a.id !== id))
    router.refresh()
  }

  const toggleActive = async (announcement: Announcement) => {
    const newStatus = !announcement.is_active
    const res = await fetch(`/api/admin/announcements/${announcement.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...announcement, is_active: newStatus }),
    })
    if (!res.ok) {
      console.error('Toggle active failed', await res.text())
      return
    }
    const result = await res.json()
    const updated = result.data
    setAnnouncements(announcements.map((a) => (a.id === announcement.id ? updated : a)))
    router.refresh()
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Announcements ({announcements.length})</CardTitle>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? "Edit Announcement" : "Add New Announcement"}</DialogTitle>
              <DialogDescription>
                {editingAnnouncement
                  ? "Update the announcement details below"
                  : "Fill in the details for the new announcement"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                
                {/* Image Upload Section */}
                <div className="grid gap-2">
                  <Label>Image (Square - 400x400px recommended)</Label>
                  {imagePreview ? (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-primary">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-1 right-1 bg-destructive rounded-full p-1 hover:bg-destructive/90"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="h-8 w-8 text-primary/60 mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload image</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">Active (visible on homepage)</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : editingAnnouncement ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {announcements.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Announcement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Bell className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{announcement.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                            {announcement.content}
                          </div>
                          {announcement.image_url && (
                            <div className="text-xs text-primary mt-1">📷 Has image</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={announcement.is_active ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleActive(announcement)}
                      >
                        {announcement.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(announcement.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(announcement)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(announcement.id)}
                          className="text-destructive hover:text-destructive"
                        >
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
          <div className="text-center py-12 text-muted-foreground">
            No announcements yet. Click &quot;Add Announcement&quot; to create one.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

