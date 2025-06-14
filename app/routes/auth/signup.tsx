import { parseWithZod } from "@conform-to/zod";
import { signUpSchema } from "~/dtos/auth/auth.dto";
import type { Route } from "./+types/signup"
import { SignupForm } from "~/components/form/auth/SignupForm";
import { prisma } from "~/lib/prisma";
import { dataWithError, redirectWithSuccess } from "remix-toast";
import { auth } from "~/lib/auth.server";

export default function Signup() {
  return <SignupForm />
}


export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: signUpSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { name, email, password } = submission.value

  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (existingUser) {
    return dataWithError(null, "User with this email already exists")
  }

  await auth.api.signUpEmail({
    headers: request.headers,
    body: {
      name,
      email,
      password
    }
  })

  return redirectWithSuccess("/login", "Account created successfully! Please log in to continue.")


}
