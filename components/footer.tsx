import { Mail, Phone, MapPin } from "lucide-react"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export async function Footer() {
  const supabase = await createClient()

  const { data: settings } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", [
      "contact_address",
      "contact_email",
      "contact_phone",
      "social_twitter",
      "social_facebook",
      "social_instagram",
      "social_linkedin",
      "social_youtube",
      "social_github",
      "social_tiktok",
    ])

  const map = settings ? Object.fromEntries(settings.map((r: any) => [r.key, r.value])) : {}

  const address = map["contact_address"] || "Computer Science Building, Main Campus"
  const email = map["contact_email"] || "cs@university.edu"
  const phone = map["contact_phone"] || "+233 20 123 4567"

  const socialLinks = [
    { key: "social_twitter", label: "Twitter", url: map["social_twitter"] || "", hoverColor: "hover:text-[#1DA1F2]" },
    { key: "social_facebook", label: "Facebook", url: map["social_facebook"] || "", hoverColor: "hover:text-[#1877F2]" },
    { key: "social_instagram", label: "Instagram", url: map["social_instagram"] || "", hoverColor: "hover:text-[#E1306C]" },
    { key: "social_linkedin", label: "LinkedIn", url: map["social_linkedin"] || "", hoverColor: "hover:text-[#0A66C2]" },
    { key: "social_youtube", label: "YouTube", url: map["social_youtube"] || "", hoverColor: "hover:text-[#FF0000]" },
    { key: "social_github", label: "GitHub", url: map["social_github"] || "", hoverColor: "hover:text-[#333333] dark:hover:text-[#FFFFFF]" },
    { key: "social_tiktok", label: "TikTok", url: map["social_tiktok"] || "", hoverColor: "hover:text-[#000000] dark:hover:text-[#FFFFFF]" },
  ]

  return (
    <footer className="border-t bg-card py-12">
      <div className="w-full px-4 sm:container sm:mx-auto">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col items-center">
            <Link href="/" className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-lg bg-transparent">
                <Logo size={96} className="w-12 sm:w-24" />
              </div>
              <div className="text-center">
                <span className="font-semibold text-lg block">Compssa Department</span>
                <span className="text-base sm:text-lg text-muted-foreground font-semibold">Accra Technical University</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering students with cutting-edge Compssa education and preparing them for successful careers
              in technology.
            </p>

            {/* Social icons below brand */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) =>
                social.url ? (
                  <a
                    key={social.key}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`p-2 rounded-full transition-colors ${social.hoverColor} text-muted-foreground`}
                  >
                    {social.label === "Twitter" && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M19.633 7.997c.013.176.013.352.013.528 0 5.386-4.098 11.596-11.596 11.596-2.305 0-4.447-.676-6.247-1.844.322.038.644.051.997.051 1.912 0 3.67-.651 5.073-1.744-1.79-.038-3.298-1.216-3.818-2.843.251.038.503.064.776.064.374 0 .749-.051 1.1-.14-1.89-.383-3.31-2.062-3.31-4.08v-.051c.56.311 1.203.502 1.887.524-1.122-.748-1.86-2.022-1.86-3.459 0-.758.203-1.478.556-2.094 2.067 2.538 5.166 4.207 8.651 4.378-.064-.299-.096-.611-.096-.923 0-2.244 1.82-4.064 4.064-4.064 1.168 0 2.224.498 2.965 1.295.923-.176 1.79-.52 2.57-.991-.301.94-.94 1.73-1.78 2.224.822-.089 1.607-.316 2.335-.64-.544.815-1.23 1.532-2.02 2.104z" />
                      </svg>
                    )}
                    {social.label === "Facebook" && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.1 5.66 21.21 10.44 22v-7.02H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.87 3.77-3.87 1.09 0 2.24.195 2.24.195v2.46h-1.26c-1.24 0-1.62.77-1.62 1.56v1.88h2.77l-.44 2.9h-2.33V22C18.34 21.21 22 17.1 22 12.07z" />
                      </svg>
                    )}
                    {social.label === "Instagram" && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.5A4.5 4.5 0 1 0 16.5 13 4.5 4.5 0 0 0 12 8.5zm6.5-3.8a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2zM12 9.7a2.3 2.3 0 1 1-2.3 2.3A2.3 2.3 0 0 1 12 9.7z" />
                      </svg>
                    )}
                    {social.label === "LinkedIn" && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-9.75 7.5H7.5V18h1.75V10.5zM9.375 8.25a1.01 1.01 0 1 0 0-2.02 1.01 1.01 0 0 0 0 2.02zM18 18h-1.75v-3.25c0-.79-.02-1.81-1.1-1.81-1.1 0-1.27.86-1.27 1.75V18H12V10.5h1.68v1h.02c.23-.44.79-1.1 1.71-1.1 1.83 0 2.17 1.2 2.17 2.75V18z" />
                      </svg>
                    )}
                    {social.label === "YouTube" && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M21.6 7.2s-.2-1.6-.8-2.3c-.8-.8-1.7-.8-2.1-.9C15.6 3.9 12 3.9 12 3.9h-.1s-3.7 0-6.7.1c-.4 0-1.4.1-2.1.9-.6.7-.8 2.3-.8 2.3S1 9 1 10.8v2.4C1 15 1.4 16.8 1.4 16.8s.2 1.6.8 2.3c.8.8 1.8.8 2.3.9 1.7.1 7.3.1 7.3.1s3.7 0 6.7-.1c.4 0 1.4-.1 2.1-.9.6-.7.8-2.3.8-2.3s.4-1.8.4-3.6v-2.4c0-1.8-.4-3.6-.4-3.6zM9.75 14.02V7.98L15.5 11l-5.75 3.02z" />
                      </svg>
                    )}
                    {social.label === "GitHub" && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.115 2.51.337 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .26.16.58.67.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
                      </svg>
                    )}
                    {social.label === "TikTok" && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.7a2.4 2.4 0 0 1-2.4 2.4 2.4 2.4 0 0 1-2.4-2.4 2.4 2.4 0 0 1 2.4-2.4c.34 0 .67.04.98.13V9.4a6.05 6.05 0 0 0-.98-.08 6.02 6.02 0 0 0-6.02 6.02 6.02 6.02 0 0 0 6.02 6.02 6.02 6.02 0 0 0 6.02-6.02v-3.02a7.86 7.86 0 0 0 3.85 1.02v-3.68a4.86 4.86 0 0 1-.85-.08z" />
                      </svg>
                    )}
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#offerings" className="hover:text-foreground transition-colors">
                  Programs
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-foreground transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#staff" className="hover:text-foreground transition-colors">
                  Staff Directory
                </a>
              </li>
              <li>
                <a href="#announcements" className="hover:text-foreground transition-colors">
                  Announcements
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${email}`} className="hover:text-foreground transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-foreground transition-colors">
                  {phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Compssa Department. All rights reserved.</p>
          <p className="text-center text-xs text-muted-foreground mt-2">Designed by Bridge Intelligence</p>
        </div>
      </div>
    </footer>
  )
}
