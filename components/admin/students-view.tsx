"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import * as XLSX from "xlsx"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Download, MoreHorizontal, Trash2, CheckCircle, XCircle, Filter, X } from "lucide-react"
import type { Student } from "@/lib/types"

interface StudentsViewProps {
  initialStudents: Student[]
}

export function StudentsView({ initialStudents }: StudentsViewProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    level: "",
    session: "",
    degree: "",
    payment_status: "",
    payment_method: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search filter
      const searchMatch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchQuery.toLowerCase())

      // Other filters
      const levelMatch = !filters.level || student.level === filters.level
      const sessionMatch = !filters.session || student.session === filters.session
      const degreeMatch = !filters.degree || student.degree === filters.degree
      const paymentStatusMatch = !filters.payment_status || student.payment_status === filters.payment_status
      const paymentMethodMatch = !filters.payment_method || student.payment_method === filters.payment_method

      return searchMatch && levelMatch && sessionMatch && degreeMatch && paymentStatusMatch && paymentMethodMatch
    })
  }, [students, searchQuery, filters])

  const clearFilters = () => {
    setFilters({
      level: "",
      session: "",
      degree: "",
      payment_status: "",
      payment_method: "",
    })
  }

  const hasActiveFilters = Object.values(filters).some(Boolean)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return

    const supabase = createClient()
    const { error } = await supabase.from("students").delete().eq("id", id)

    if (!error) {
      setStudents(students.filter((s) => s.id !== id))
      router.refresh()
    }
  }

  const togglePaymentStatus = async (student: Student) => {
    const supabase = createClient()
    const newStatus = student.payment_status === "paid" ? "pending" : "paid"

    const { error } = await supabase.from("students").update({ payment_status: newStatus }).eq("id", student.id)

    if (!error) {
      setStudents(students.map((s) => (s.id === student.id ? { ...s, payment_status: newStatus } : s)))
      router.refresh()
    }
  }

  const exportToExcel = () => {
    const headers = [
      "Name",
      "Email",
      "Student ID",
      "Sex",
      "Programme",
      "Degree",
      "Session",
      "Level",
      "Lacoste Size",
      "Payment Method",
      "Payment Status",
      "Registered By",
      "Registration Date",
    ]

    const excelData = filteredStudents.map((student) => [
      student.name,
      student.email,
      student.student_id,
      student.sex,
      student.programme,
      student.degree,
      student.session,
      student.level,
      student.lacoste_size,
      student.payment_method,
      student.payment_status,
      student.registered_by_email || "",
      new Date(student.created_at).toLocaleDateString(),
    ])

    // Create workbook and worksheet
    const ws = XLSX.utils.aoa_to_sheet([headers, ...excelData])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Students")

    // Auto-size columns
    const colWidths = headers.map(() => 15)
    ws["!cols"] = colWidths.map((width) => ({ wch: width }))

    // Generate file
    XLSX.writeFile(wb, `students_export_${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1">
                    {Object.values(filters).filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              <Button onClick={exportToExcel} className="gap-2">
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Filter Students</h4>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                    <X className="h-3 w-3" />
                    Clear all
                  </Button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Select value={filters.level} onValueChange={(value) => setFilters({ ...filters, level: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">Level 100</SelectItem>
                    <SelectItem value="200">Level 200</SelectItem>
                    <SelectItem value="300">Level 300</SelectItem>
                    <SelectItem value="400">Level 400</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.session} onValueChange={(value) => setFilters({ ...filters, session: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sessions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.degree} onValueChange={(value) => setFilters({ ...filters, degree: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Degrees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="HND">HND</SelectItem>
                    <SelectItem value="BTech">BTech</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.payment_status}
                  onValueChange={(value) => setFilters({ ...filters, payment_status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.payment_method}
                  onValueChange={(value) => setFilters({ ...filters, payment_method: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Momo">Mobile Money</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Students ({filteredStudents.length}
            {filteredStudents.length !== students.length && ` of ${students.length}`})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Degree</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Registered By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{student.student_id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.degree}</Badge>
                      </TableCell>
                      <TableCell>{student.level}</TableCell>
                      <TableCell>{student.session}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={student.payment_status === "paid" ? "default" : "secondary"}
                            className={student.payment_status === "paid" ? "bg-accent text-accent-foreground" : ""}
                          >
                            {student.payment_status === "paid" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {student.payment_status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{student.payment_method}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {student.registered_by_email || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => togglePaymentStatus(student)}>
                              {student.payment_status === "paid" ? (
                                <>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Mark as Pending
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as Paid
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(student.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {students.length === 0 ? "No students registered yet." : "No students match your search criteria."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
