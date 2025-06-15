import { parseWithZod } from "@conform-to/zod";
import { loginSchema } from "~/dtos/auth/auth.dto";
import type { Route } from "./+types/login"
import { LoginForm } from "~/components/form/auth/LoginForm";
import { prisma } from "~/lib/prisma";
import { dataWithError, redirectWithSuccess } from "remix-toast";
import { auth } from "~/lib/auth.server";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        linkUsername: true
      }
    });

    if (user) {
      if (user.linkUsername) {
        return redirect("/profile");
      } else {
        return redirect("/hub");
      }
    }
  }

  return null;
}

export default function Login() {
  return <LoginForm />
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: loginSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { email, password } = submission.value

  const user = await prisma.user.findUnique({
    where: {
      email
    },
    select: {
      id: true,
      name: true,
      hasUsername: true,
      linkUsername: true,
      accounts: {
        select: {
          password: true
        }
      }
    }
  })


  if (!user) {
    return dataWithError("/login", { message: "Invalid email or password" })
  }

  const hashedPassword = user?.accounts[0]?.password;


  if (!hashedPassword) {
    return dataWithError("/login", { message: "Invalid email or password" })
  }

  const ctx = await auth.$context;
  const isMatch = await ctx.password.verify({ password, hash: hashedPassword });

  if (!isMatch) {
    return dataWithError("/login", { message: "Invalid email or password" })
  }


  const { headers } = await auth.api.signInEmail({
    returnHeaders: true,
    body: {
      email,
      password
    }
  })

  const redirectPath = user.hasUsername && user.linkUsername ? "/profile" : "/hub";
  return redirectWithSuccess(redirectPath, { message: `Welcome ${String(user.name)}.` }, { headers })
}
