"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, GraduationCap, BookOpen, Award, Lightbulb, Building, Monitor } from "lucide-react"
import type { DepartmentOffering } from "@/lib/types"

interface OfferingsManagerProps {
  initialOfferings: DepartmentOffering[]
}

const iconOptions = [
  { value: "GraduationCap", label: "Graduation Cap", icon: GraduationCap },
  { value: "BookOpen", label: "Book", icon: BookOpen },
  { value: "Award", label: "Award", icon: Award },
  { value: "Lightbulb", label: "Lightbulb", icon: Lightbulb },
  { value: "Building", label: "Building", icon: Building },
  { value: "Monitor", label: "Monitor", icon: Monitor },
]

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="h-5 w-5" />,
  BookOpen: <BookOpen className="h-5 w-5" />,
  Award: <Award className="h-5 w-5" />,
  Lightbulb: <Lightbulb className="h-5 w-5" />,
  Building: <Building className="h-5 w-5" />,
  Monitor: <Monitor className="h-5 w-5" />,
}

export function OfferingsManager({ initialOfferings }: OfferingsManagerProps) {
  const [offerings, setOfferings] = useState<DepartmentOffering[]>(initialOfferings)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingOffering, setEditingOffering] = useState<DepartmentOffering | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "BookOpen",
    display_order: 0,
  })
  const router = useRouter()

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "BookOpen",
      display_order: offerings.length + 1,
    })
    setEditingOffering(null)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) resetForm()
  }

  const handleEdit = (offering: DepartmentOffering) => {
    setEditingOffering(offering)
    setFormData({
      title: offering.title,
      description: offering.description,
      icon: offering.icon || "BookOpen",
      display_order: offering.display_order,
    })
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const supabase = createClient()

    try {
      if (editingOffering) {
        const { error } = await supabase
          .from("department_offerings")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingOffering.id)

        if (error) throw error

        setOfferings(offerings.map((o) => (o.id === editingOffering.id ? { ...o, ...formData } : o)))
      } else {
        const { data, error } = await supabase.from("department_offerings").insert(formData).select().single()

        if (error) throw error
        setOfferings([...offerings, data])
      }

      setIsOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error("Error saving offering:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offering?")) return

    const supabase = createClient()
    const { error } = await supabase.from("department_offerings").delete().eq("id", id)

    if (!error) {
      setOfferings(offerings.filter((o) => o.id !== id))
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Offerings ({offerings.length})</CardTitle>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Offering
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingOffering ? "Edit Offering" : "Add New Offering"}</DialogTitle>
              <DialogDescription>
                {editingOffering ? "Update the offering details below" : "Fill in the details for the new offering"}
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
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => {
                          const Icon = option.icon
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : editingOffering ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {offerings.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offerings.map((offering) => (
                  <TableRow key={offering.id}>
                    <TableCell>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {offering.icon && iconMap[offering.icon] ? (
                          iconMap[offering.icon]
                        ) : (
                          <BookOpen className="h-5 w-5" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{offering.title}</TableCell>
                    <TableCell className="max-w-xs">
                      <span className="line-clamp-2 text-sm text-muted-foreground">{offering.description}</span>
                    </TableCell>
                    <TableCell>{offering.display_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(offering)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(offering.id)}
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
            No offerings yet. Click &quot;Add Offering&quot; to create one.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
