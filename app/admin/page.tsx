import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Lightbulb, Users, Bell, UsersRound, TrendingUp, Image, MessageSquare } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch counts in parallel
  const [eventsRes, offeringsRes, staffRes, announcementsRes, studentsRes, clubsRes, galleryRes, headMessagesRes] = await Promise.all([
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("department_offerings").select("id", { count: "exact", head: true }),
    supabase.from("staff").select("id", { count: "exact", head: true }),
    supabase.from("announcements").select("id", { count: "exact", head: true }),
    supabase.from("students").select("id", { count: "exact", head: true }),
    supabase.from("clubs").select("id", { count: "exact", head: true }),
    supabase.from("gallery_images").select("id", { count: "exact", head: true }),
    supabase.from("head_messages").select("id", { count: "exact", head: true }),
  ])

  const stats = [
    {
      label: "Events",
      value: eventsRes.count || 0,
      icon: Calendar,
      href: "/admin/events",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Offerings",
      value: offeringsRes.count || 0,
      icon: Lightbulb,
      href: "/admin/offerings",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Staff Members",
      value: staffRes.count || 0,
      icon: Users,
      href: "/admin/staff",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Announcements",
      value: announcementsRes.count || 0,
      icon: Bell,
      href: "/admin/announcements",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      label: "Students Registered",
      value: studentsRes.count || 0,
      icon: UsersRound,
      href: "/admin/students",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      label: "Clubs",
      value: clubsRes?.count || 0,
      icon: TrendingUp,
      href: "/admin/clubs",
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
    {
      label: "Gallery Images",
      value: galleryRes?.count || 0,
      icon: Image,
      href: "/admin/gallery",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Head Messages",
      value: headMessagesRes?.count || 0,
      icon: MessageSquare,
      href: "/admin/head-messages",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
  ]

  // Get recent students
  const { data: recentStudents } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Compssa Department Admin Portal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent Registrations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Registrations</CardTitle>
            <p className="text-sm text-muted-foreground">Latest student registrations</p>
          </div>
          <Link href="/admin/students" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentStudents && recentStudents.length > 0 ? (
            <div className="space-y-4">
              {recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.student_id} • {student.degree} • Level {student.level}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">{new Date(student.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No students registered yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
