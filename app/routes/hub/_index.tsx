import type { Route } from "./+types/_index";
import { Button } from "~/components/ui/button";
import { Form, Link, useLoaderData } from "react-router";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { auth } from "~/lib/auth.server";
import { redirect } from "react-router";
import { prisma } from "~/lib/prisma";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { dataWithError } from "remix-toast";
import { useForm, getFormProps, getInputProps, } from "@conform-to/react";


export const linkUsernameSchema = z.object({
  linkUsername: z.string().min(3).max(20).trim()
})

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (!session) {
    return redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      email: true,
      linkUsername: true
    }
  })

  if (!user) {
    return redirect("/login");
  }


  return {
    user
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema: linkUsernameSchema })

  if (submission.status !== "success") {
    return submission.reply()
  }

  const { linkUsername } = submission.value

  const session = await auth.api.getSession({
    headers: request.headers
  })

  if (!session) {
    return dataWithError(null, "You are not logged in")
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      linkUsername
    }
  })

  if (existingUser) {
    return dataWithError(null, "Username already taken. Please choose another one.")
  }

  await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      hasUsername: true,
      linkUsername
    }
  })

  return redirect("/profile")
}

export default function Hub() {
  const { user } = useLoaderData<typeof loader>();
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: linkUsernameSchema })
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput"
  })
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              lynqr.me
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-slate-800 leading-tight">
              Create your digital
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                connection hub
              </span>
            </h1>
            <div className="text-slate-600 space-y-2">
              <p>
                Choose your unique lynqr username for{" "}
                <span className="font-semibold text-slate-800">{user.email}</span>
              </p>
              <p className="text-sm">Don't worry, you can update it anytime later.</p>
            </div>
          </div>

          <Form method="post" {...getFormProps(form)} className="space-y-6">
            <div className="relative group">
              <div className="flex items-center bg-white border-2 border-slate-200 group-focus-within:border-blue-400 rounded-2xl px-5 py-4 shadow-sm transition-all duration-200">
                <span className="text-slate-500 font-medium">lynqr.me/</span>
                <Input
                  {...getInputProps(fields.linkUsername, { type: "text" })}
                  type="text"
                  placeholder="yourname"
                  className="border-0 bg-transparent focus:ring-0 focus:outline-none p-0 ml-1 font-medium text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 space-y-3">
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Unlimited links and connections</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Custom themes and branding</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Analytics and insights</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl py-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Create My Lynqr
            </Button>

          </Form>
        </div>
      </div>

      {/* Right Side - Visual Preview */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-20 w-40 h-40 border border-white rounded-full animate-pulse delay-500"></div>
        </div>

        {/* Floating Connection Nodes */}
        <div className="absolute top-20 right-16 transform rotate-12 animate-float">
          <Card className="bg-white/15 backdrop-blur-md border-white/20 p-4 rounded-3xl shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">IG</span>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Instagram</div>
                <div className="text-white/70 text-xs">@yourhandle</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Profile Preview */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-3">
          <Card className="bg-white/20 backdrop-blur-lg border-white/30 p-8 rounded-3xl w-80 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full mx-auto p-1">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl">👋</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
              </div>

              <div>
                <h3 className="text-white font-bold text-xl">Your Name</h3>
                <p className="text-white/80 text-sm">lynqr.me/yourname</p>
              </div>

              <div className="space-y-3">
                <div className="bg-white/25 backdrop-blur-sm rounded-2xl py-3 px-4 hover:bg-white/30 transition-colors cursor-pointer">
                  <span className="text-white font-medium text-sm">🎵 My Spotify Playlist</span>
                </div>
                <div className="bg-white/25 backdrop-blur-sm rounded-2xl py-3 px-4 hover:bg-white/30 transition-colors cursor-pointer">
                  <span className="text-white font-medium text-sm">📸 Photography Portfolio</span>
                </div>
                <div className="bg-white/25 backdrop-blur-sm rounded-2xl py-3 px-4 hover:bg-white/30 transition-colors cursor-pointer">
                  <span className="text-white font-medium text-sm">💼 Professional Resume</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Social Platform Icons */}
        <div className="absolute bottom-24 right-16 flex space-x-4">
          <div className="w-14 h-14 bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300 cursor-pointer shadow-lg">
            <span className="text-white text-xl">📱</span>
          </div>
          <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300 cursor-pointer shadow-lg">
            <span className="text-white text-xl">🐦</span>
          </div>
          <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-300 cursor-pointer shadow-lg">
            <span className="text-white text-xl">🎮</span>
          </div>
        </div>

        {/* Connection Lines */}
        <div className="absolute top-32 left-1/4 w-px h-24 bg-gradient-to-b from-white/50 to-transparent"></div>
        <div className="absolute top-56 left-1/4 w-24 h-px bg-gradient-to-r from-white/50 to-transparent"></div>

        {/* Floating Analytics Card */}
        <div className="absolute top-1/4 left-12 transform -rotate-6 animate-float-delayed">
          <Card className="bg-white/15 backdrop-blur-md border-white/20 p-4 rounded-2xl shadow-xl">
            <div className="text-white space-y-2">
              <div className="text-xs font-semibold opacity-80">This Week</div>
              <div className="text-2xl font-bold">2.4k</div>
              <div className="text-xs opacity-80">Profile Views</div>
            </div>
          </Card>
        </div>

        {/* QR Code Preview */}
        <div className="absolute bottom-1/4 left-16 transform rotate-12">
          <Card className="bg-white/20 backdrop-blur-md border-white/30 p-4 rounded-2xl shadow-xl">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded opacity-80"></div>
            </div>
            <div className="text-white text-xs mt-2 text-center font-medium">Your QR</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
