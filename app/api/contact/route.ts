import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

// Email validation
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: Request) {
  try {
    if (!SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      )
    }

    // Save to database
    const service = createServiceClient(SUPABASE_URL, SERVICE_ROLE_KEY)
    const { data, error } = await service
      .from('contact_submissions')
      .insert({ name, email, subject, message, is_read: false })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      )
    }

    console.log('Contact submission saved:', { id: data.id, name, email, subject })

    // Optional: Send email notification
    // Uncomment the email sending code below if you want to send emails

    // Option 1: Using Nodemailer with Gmail
    // const nodemailer = require('nodemailer')
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.GMAIL_USER,
    //     pass: process.env.GMAIL_PASSWORD,
    //   },
    // })
    // await transporter.sendMail({
    //   from: process.env.GMAIL_USER,
    //   to: process.env.CONTACT_EMAIL || 'contact@department.edu',
    //   replyTo: email,
    //   subject: `New Contact Form: ${subject}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Subject:</strong> ${subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message.replace(/\n/g, '<br>')}</p>
    //   `,
    // })

    return NextResponse.json(
      { message: 'Message received successfully', data },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to process contact form' },
      { status: 500 }
    )
  }
}
