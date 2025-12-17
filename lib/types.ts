export interface Admin {
  id: string
  email: string
  name: string | null
  role: "admin" | "president" | "financial_officer"
  created_at: string
}

export interface DepartmentOffering {
  id: string
  title: string
  description: string
  icon: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  image_url: string | null
  event_date: string
  event_time: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export interface Staff {
  id: string
  name: string
  role: string
  email: string | null
  phone: string | null
  image_url: string | null
  display_order: number
  staff_type: "dean" | "hod" | "faculty" | "staff" | "executive"
  created_at: string
  updated_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface HeadMessage {
  id: string
  title: string
  name: string
  message: string
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  name: string
  email: string
  student_id: string
  sex: "Male" | "Female"
  programme: string
  degree: "HND" | "BTech" | "Diploma"
  session: "Regular" | "Part-time"
  level: "100" | "200" | "300" | "400"
  lacoste_size: "S" | "M" | "L" | "XL" | "2XL" | "3XL"
  payment_method: "Momo" | "Cash"
  payment_status: "pending" | "paid"
  registered_by: string | null
  registered_by_email: string | null
  created_at: string
  updated_at: string
}

export interface Finance {
  id: string
  amount: number
  description: string
  transaction_type: "income" | "expense"
  transaction_date: string
  recorded_by: string | null
  recorded_by_email: string | null
  created_at: string
}

export interface Club {
  id: string
  title: string
  description: string | null
  links: string[]
  display_order: number
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  title: string
  description: string | null
  image_url: string
  display_order: number
  created_at: string
  updated_at: string
}
export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}