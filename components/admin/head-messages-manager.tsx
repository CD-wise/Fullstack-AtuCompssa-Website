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
import { Plus, Pencil, Trash2, Image as ImageIcon, X } from "lucide-react"
import type { HeadMessage } from "@/lib/types"
import Image from "next/image"

interface HeadMessagesManagerProps {
  initialMessages: HeadMessage[]
}

export function HeadMessagesManager({ initialMessages }: HeadMessagesManagerProps) {
  const [messages, setMessages] = useState<HeadMessage[]>(initialMessages)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingMessage, setEditingMessage] = useState<HeadMessage | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    message: "",
    is_active: true,
  })
  const router = useRouter()

  const resetForm = () => {
    setFormData({
      title: "",
      name: "",
      message: "",
      is_active: true,
    })
    setEditingMessage(null)
    setImagePreview(null)
    setSelectedFile(null)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) resetForm()
  }

  const handleEdit = (msg: HeadMessage) => {
    setEditingMessage(msg)
    setFormData({
      title: msg.title,
      name: msg.name,
      message: msg.message,
      is_active: msg.is_active,
    })
    setImagePreview(msg.image_url)
    setSelectedFile(null)
    setIsOpen(true)
  }

  // Resize image file to max dimensions
  const resizeImageFile = (file: File, maxWidth = 500, maxHeight = 500): Promise<File> => {
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const resized = await resizeImageFile(file, 500, 500)
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
      let imageUrl = editingMessage?.image_url || null

      // Upload image if selected
      if (selectedFile) {
        console.log('Uploading image:', selectedFile.name)
        // Get file extension from the file type
        const ext = selectedFile.type.split('/')[1] || 'jpg'
        const fileName = `head-message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("announcements")
          .upload(fileName, selectedFile, { upsert: false })

        if (uploadError) {
          const msg = uploadError?.message || String(uploadError)
          if (/bucket not found/i.test(msg) || /not found/i.test(msg)) {
            throw new Error(
              "Storage bucket 'announcements' not found. Create a bucket named 'announcements' in your Supabase project's Storage and retry."
            )
          }
          throw uploadError
        }

        const { data: urlData } = supabase.storage
          .from("announcements")
          .getPublicUrl(uploadData.path)

        imageUrl = urlData.publicUrl
        console.log('Image uploaded successfully, URL:', imageUrl)
      } else {
        console.log('No image selected, keeping existing URL:', imageUrl)
      }

      if (editingMessage) {
        console.log('Sending update request with data:', { ...formData, image_url: imageUrl })
        const res = await fetch(`/api/admin/head-messages/${editingMessage.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, image_url: imageUrl }),
        })

        if (!res.ok) {
          const text = await res.text()
          console.error('Update head message failed', res.status, text)
          throw new Error(text || "Failed to update head message")
        }

        const result = await res.json()
        const updated = result.data
        setMessages(messages.map((m) => (m.id === editingMessage.id ? updated : m)))
      } else {
        console.log('Sending create request with data:', { ...formData, image_url: imageUrl })
        const res = await fetch(`/api/admin/head-messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, image_url: imageUrl }),
        })

        if (!res.ok) {
          const text = await res.text()
          console.error('Create head message failed', res.status, text)
          throw new Error(text || "Failed to create head message")
        }

        const result = await res.json()
        setMessages([result.data, ...messages])
      }

      setIsOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error("Error saving head message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this head message?")) return

    const res = await fetch(`/api/admin/head-messages/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const text = await res.text()
      console.error('Delete failed:', text)
      return
    }
    setMessages(messages.filter((m) => m.id !== id))
    router.refresh()
  }

  const toggleActive = async (msg: HeadMessage) => {
    const newStatus = !msg.is_active
    const res = await fetch(`/api/admin/head-messages/${msg.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...msg, is_active: newStatus }),
    })
    if (!res.ok) {
      console.error('Toggle active failed', await res.text())
      return
    }
    const result = await res.json()
    const updated = result.data
    setMessages(messages.map((m) => (m.id === msg.id ? updated : m)))
    router.refresh()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Head Messages ({messages.length})</CardTitle>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Head Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMessage ? "Edit Head Message" : "Add New Head Message"}</DialogTitle>
              <DialogDescription>
                {editingMessage
                  ? "Update the head message details below"
                  : "Fill in the details for a new head message (Head of Department or Faculty Dean)"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Head of Department of Computer Science"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Dr. John Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    required
                  />
                </div>

                {/* Image Upload Section */}
                <div className="grid gap-2">
                  <Label>Image (Square - 500x500px recommended)</Label>
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
                  {isLoading ? "Saving..." : editingMessage ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {messages.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Head Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        {msg.image_url && (
                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg overflow-hidden">
                            <Image
                              src={msg.image_url}
                              alt={msg.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{msg.name}</div>
                          <div className="text-sm text-muted-foreground">{msg.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1 max-w-md mt-1">
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={msg.is_active ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleActive(msg)}
                      >
                        {msg.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(msg)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(msg.id)}
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
            No head messages yet. Click &quot;Add Head Message&quot; to create one.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
