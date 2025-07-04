import { getFormProps, getInputProps } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { Separator } from "~/components/ui/separator"
import { Button } from "~/components/ui/button"
import { useForm } from "@conform-to/react"
import { Form, Link } from "react-router"
import { Label } from "~/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { signUpSchema } from "~/dtos/auth/auth.dto"
import { authClient } from "~/lib/auth.client"

export function SignupForm() {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signUpSchema })
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  })
  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Get started by creating a new account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form method="post" {...getFormProps(form)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input {...getInputProps(fields.name, { type: "text" })} id="name" name="name" type="text" placeholder="Enter your full name" className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input {...getInputProps(fields.email, { type: "email" })} id="email" name="email" type="email" placeholder="Enter your email" className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input {...getInputProps(fields.password, { type: "password" })} id="password" name="password" type="password" placeholder="Create a password" className="w-full" />
          </div>

          <div className="text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </div>

          <Button type="submit" className="w-full">
            Create account
          </Button>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button onClick={async () => {
          await authClient.signIn.social({
            provider: "google"
          })
        }} variant="outline" className="w-full" type="button">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
