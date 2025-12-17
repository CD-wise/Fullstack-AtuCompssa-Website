"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Mail, Trash2, Eye, EyeOff } from "lucide-react"
import type { ContactSubmission } from "@/lib/types"

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading messages:", error)
        return
      }

      setMessages(data || [])
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return

    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting:", error)
      return
    }

    setMessages(messages.filter((m) => m.id !== id))
    setSelectedMessage(null)
  }

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ is_read: !isRead })
      .eq("id", id)

    if (error) {
      console.error("Error updating:", error)
      return
    }

    setMessages(
      messages.map((m) =>
        m.id === id ? { ...m, is_read: !isRead } : m
      )
    )

    if (selectedMessage?.id === id) {
      setSelectedMessage({ ...selectedMessage, is_read: !isRead })
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const unreadCount = messages.filter((m) => !m.is_read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground mt-1">
            {messages.length} total • {unreadCount} unread
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No messages yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow
                      key={message.id}
                      className={!message.is_read ? "bg-primary/5" : ""}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{message.name}</p>
                          <p className="text-sm text-muted-foreground">{message.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(message.created_at)}</TableCell>
                      <TableCell>
                        <Badge variant={message.is_read ? "outline" : "default"}>
                          {message.is_read ? "Read" : "Unread"}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-2 flex">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedMessage(message)}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(message.id, message.is_read)}
                        >
                          {message.is_read ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(message.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject}</DialogTitle>
                <DialogDescription>
                  From: {selectedMessage.name} ({selectedMessage.email})
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Sent</p>
                  <p>{formatDate(selectedMessage.created_at)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Message</p>
                  <div className="bg-slate-50 rounded-lg p-4 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => handleMarkAsRead(selectedMessage.id, selectedMessage.is_read)}
                  >
                    {selectedMessage.is_read ? "Mark as Unread" : "Mark as Read"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = `mailto:${selectedMessage.email}`}
                  >
                    Reply via Email
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDelete(selectedMessage.id)
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
