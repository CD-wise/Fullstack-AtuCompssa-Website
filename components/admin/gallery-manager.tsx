"use client"

import React, { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { GalleryImage } from "@/lib/types"
import { ImageUpload } from "@/components/ui/image-upload"

interface GalleryManagerProps {
  initialImages: GalleryImage[]
}

export function GalleryManager({ initialImages }: GalleryManagerProps) {
  const router = useRouter()
  const [images, setImages] = useState<GalleryImage[]>(initialImages)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
    })
    setEditingImage(null)
  }

  const handleOpenDialog = (image?: GalleryImage) => {
    if (image) {
      setFormData({
        title: image.title,
        description: image.description || "",
        image_url: image.image_url,
      })
      setEditingImage(image)
    } else {
      resetForm()
    }
    setIsOpen(true)
  }

  const handleCloseDialog = () => {
    setIsOpen(false)
    resetForm()
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.image_url.trim()) {
      alert("Title and image URL are required")
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      if (editingImage) {
        const { error } = await supabase
          .from("gallery_images")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingImage.id)

        if (error) throw error

        setImages(
          images.map((img) =>
            img.id === editingImage.id ? { ...img, ...formData, updated_at: new Date().toISOString() } : img
          )
        )
      } else {
        const { data, error } = await supabase
          .from("gallery_images")
          .insert({
            ...formData,
            display_order: images.length,
          })
          .select()
          .single()

        if (error) throw error
        setImages([...images, data])
      }

      handleCloseDialog()
      router.refresh()
    } catch (error) {
      console.error("Error saving image:", error)
      alert(error instanceof Error ? error.message : "Failed to save image")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      // Find image to get stored URL (so we can remove the storage object)
      const target = images.find((img) => img.id === id)

      const { error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", id)

      if (error) throw error

      // Attempt to remove file from Supabase Storage if it exists in the department-images bucket
      try {
        if (target && target.image_url) {
          // Try to extract the storage path from the public URL
          // Supabase public URL often contains "/department-images/" followed by the file path
          const match = target.image_url.match(/department-images\/(.*)$/)
          const objectPath = match ? decodeURIComponent(match[1]) : null

          if (objectPath) {
            await supabase.storage.from("department-images").remove([objectPath])
          }
        }
      } catch (remErr) {
        // Non-fatal if storage deletion fails
        console.warn("Failed to remove storage object:", remErr)
      }

      setImages(images.filter((img) => img.id !== id))
      router.refresh()
    } catch (error) {
      console.error("Error deleting image:", error)
      alert(error instanceof Error ? error.message : "Failed to delete image")
    } finally {
      setIsLoading(false)
    }
  }

  const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order)

  return (
    <Card className="p-6 card-glow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-1">Gallery Management</h3>
          <p className="text-muted-foreground text-sm">
            Manage department activity images for the carousel
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="btn-tech gap-2"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4" />
          Add Image
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {editingImage ? "Edit Gallery Image" : "Add Gallery Image"}
            </DialogTitle>
            <DialogDescription>
              {editingImage
                ? "Update the gallery image details"
                : "Add a new image to the department gallery carousel"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Title *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Department Retreat 2024"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the image (optional)"
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <ImageUpload
                label="Upload Image"
                value={formData.image_url}
                onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
                folder="gallery"
              />
              <p className="text-xs text-muted-foreground">
                Upload an image from your device. Files are stored in Supabase Storage and a public URL is saved automatically.
              </p>
            </div>

            {/* Image preview */}
            {formData.image_url && (
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground mb-2">Preview</p>
                <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden border border-border">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3EInvalid URL%3C/text%3E%3C/svg%3E"
                    }}
                  />
                </div>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" className="btn-tech" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : editingImage
                    ? "Update Image"
                    : "Add Image"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Images Table */}
      {sortedImages.length > 0 ? (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </TableHead>
                <TableHead className="w-24">Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Description</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedImages.map((image, index) => (
                <TableRow
                  key={image.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-20 h-12 rounded overflow-hidden bg-muted border border-border">
                      <img
                        src={image.image_url}
                        alt={image.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='10' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{image.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(image.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {image.description || "—"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(image)}
                        disabled={isLoading}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(image.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card className="p-8 text-center bg-muted/50 border-dashed">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground font-medium">No images yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Add your first department activity image to get started
          </p>
          <Button
            onClick={() => handleOpenDialog()}
            variant="outline"
            className="gap-2"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
            Add First Image
          </Button>
        </Card>
      )}
    </Card>
  )
}
