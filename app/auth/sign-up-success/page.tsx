import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, ArrowRight } from "lucide-react"
import { Logo } from "@/components/logo"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-secondary/30 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-4">
              <div className="flex h-16 w-16 sm:h-28 sm:w-28 items-center justify-center rounded-lg bg-transparent">
                <Logo size={120} className="w-12 sm:w-28" />
              </div>
              <span className="font-semibold text-xl">Compssa Department</span>
            </Link>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Mail className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>We&apos;ve sent you a confirmation link</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-6">
                Please check your email inbox and click on the confirmation link to activate your admin account.
              </p>
              <Link href="/auth/login">
                <Button className="w-full gap-2">
                  Continue to Login
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              &larr; Back to Homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
