"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Plus, TrendingUp, TrendingDown, Wallet, DollarSign, Search, CheckCircle, XCircle, Trash2 } from "lucide-react"
import type { Student, Finance } from "@/lib/types"

interface FinanceManagerProps {
  initialStudents: Student[]
  initialTransactions: Finance[]
  adminId: string
  adminEmail: string
}

export function FinanceManager({ initialStudents, initialTransactions, adminId, adminEmail }: FinanceManagerProps) {
  const [students] = useState<Student[]>(initialStudents)
  const [transactions, setTransactions] = useState<Finance[]>(initialTransactions)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    transaction_type: "income",
    transaction_date: new Date().toISOString().split("T")[0],
  })
  const router = useRouter()

  // Calculate financial summary
  const financialSummary = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.transaction_type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalExpenses = transactions
      .filter((t) => t.transaction_type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
    }
  }, [transactions])

  // Filter students by search
  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [students, searchQuery])

  const resetForm = () => {
    setFormData({
      amount: "",
      description: "",
      transaction_type: "income",
      transaction_date: new Date().toISOString().split("T")[0],
    })
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("finance")
        .insert({
          amount: Number.parseFloat(formData.amount),
          description: formData.description,
          transaction_type: formData.transaction_type,
          transaction_date: formData.transaction_date,
          recorded_by: adminId,
          recorded_by_email: adminEmail,
        })
        .select()
        .single()

      if (error) throw error

      setTransactions([data, ...transactions])
      setIsOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error("Error saving transaction:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return

    const supabase = createClient()
    const { error } = await supabase.from("finance").delete().eq("id", id)

    if (!error) {
      setTransactions(transactions.filter((t) => t.id !== id))
      router.refresh()
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(financialSummary.totalIncome)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <div className="p-2 rounded-lg bg-red-500/10">
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(financialSummary.totalExpenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${financialSummary.balance >= 0 ? "text-primary" : "text-red-600"}`}>
              {formatCurrency(financialSummary.balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Students and Transactions */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Student Payments</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>All Students & Payment Details</CardTitle>
                  <CardDescription>View payment status and registering admin for each student</CardDescription>
                </div>
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Degree/Level</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Registered By</TableHead>
                        <TableHead>Date</TableHead>
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
                            <div className="text-sm">
                              <div>{student.degree}</div>
                              <div className="text-muted-foreground">Level {student.level}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{student.payment_method}</Badge>
                          </TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {student.registered_by_email || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(student.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">No students found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Financial Transactions</CardTitle>
                <CardDescription>Record income and expenses for the department</CardDescription>
              </div>
              <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                    <DialogDescription>Record a new income or expense transaction</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="transaction_type">Type *</Label>
                        <Select
                          value={formData.transaction_type}
                          onValueChange={(value) => setFormData({ ...formData, transaction_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                Income
                              </div>
                            </SelectItem>
                            <SelectItem value="expense">
                              <div className="flex items-center gap-2">
                                <TrendingDown className="h-4 w-4 text-red-500" />
                                Expense
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="amount">Amount (GHS) *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="pl-9"
                            placeholder="0.00"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Enter transaction details..."
                          rows={3}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="transaction_date">Date *</Label>
                        <Input
                          id="transaction_date"
                          type="date"
                          value={formData.transaction_date}
                          onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Add Transaction"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Recorded By</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <Badge
                              variant={transaction.transaction_type === "income" ? "default" : "destructive"}
                              className={
                                transaction.transaction_type === "income"
                                  ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                                  : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                              }
                            >
                              {transaction.transaction_type === "income" ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {transaction.transaction_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <span className="line-clamp-2">{transaction.description}</span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-medium ${transaction.transaction_type === "income" ? "text-green-600" : "text-red-600"}`}
                            >
                              {transaction.transaction_type === "income" ? "+" : "-"}
                              {formatCurrency(Number(transaction.amount))}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(transaction.transaction_date)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {transaction.recorded_by_email || "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No transactions recorded yet. Click &quot;Add Transaction&quot; to create one.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
