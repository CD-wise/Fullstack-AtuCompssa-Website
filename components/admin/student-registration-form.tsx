"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, CheckCircle } from "lucide-react"

interface StudentRegistrationFormProps {
  adminId: string
  adminEmail: string
}

export function StudentRegistrationForm({ adminId, adminEmail }: StudentRegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    student_id: "",
    sex: "",
    programme: "Computer Science",
    degree: "",
    session: "",
    level: "",
    lacoste_size: "",
    payment_method: "",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()

    try {
      const { error: insertError } = await supabase.from("students").insert({
        ...formData,
        registered_by: adminId,
        registered_by_email: adminEmail,
        payment_status: "pending",
      })

      if (insertError) throw insertError

      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        student_id: "",
        sex: "",
        programme: "Computer Science",
        degree: "",
        session: "",
        level: "",
        lacoste_size: "",
        payment_method: "",
      })

      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to register student")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Student Registration Form
        </CardTitle>
        <CardDescription>Fill out all required fields to register a new student</CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-accent/10 p-4 text-accent">
            <CheckCircle className="h-5 w-5" />
            <span>Student registered successfully!</span>
          </div>
        )}

        {error && <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Personal Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@email.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="student_id">Student ID *</Label>
                <Input
                  id="student_id"
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  placeholder="CS/2024/001"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sex">Sex *</Label>
                <Select
                  value={formData.sex}
                  onValueChange={(value) => setFormData({ ...formData, sex: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Academic Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="programme">Programme</Label>
                <Input
                  id="programme"
                  value={formData.programme}
                  onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="degree">Degree *</Label>
                <Select
                  value={formData.degree}
                  onValueChange={(value) => setFormData({ ...formData, degree: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="HND">HND</SelectItem>
                    <SelectItem value="BTech">BTech</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="session">Session *</Label>
                <Select
                  value={formData.session}
                  onValueChange={(value) => setFormData({ ...formData, session: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="level">Level *</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">Level 100</SelectItem>
                    <SelectItem value="200">Level 200</SelectItem>
                    <SelectItem value="300">Level 300</SelectItem>
                    <SelectItem value="400">Level 400</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Additional Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="lacoste_size">Lacoste Size *</Label>
                <Select
                  value={formData.lacoste_size}
                  onValueChange={(value) => setFormData({ ...formData, lacoste_size: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="XL">XL</SelectItem>
                    <SelectItem value="2XL">2XL</SelectItem>
                    <SelectItem value="3XL">3XL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment_method">Payment Method *</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Momo">Mobile Money (Momo)</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="gap-2" disabled={isLoading}>
              <UserPlus className="h-4 w-4" />
              {isLoading ? "Registering..." : "Register Student"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
