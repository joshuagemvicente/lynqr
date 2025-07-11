import { type RouteConfig, index, prefix, route, layout } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
layout("./routes/auth/_auth.layout.tsx", [
  route("login", "./routes/auth/login.tsx"),
  route("signup", "./routes/auth/signup.tsx"),

]),
layout("./routes/hub/_hub.layout.tsx", [
  ...prefix("hub", [
    index("./routes/hub/_index.tsx")
  ]),
]),

layout("./routes/profile/_profile.layout.tsx", [
  route("profile", "./routes/profile/index.tsx", [
    route("add", "./routes/profile/add.tsx"),
    route(":linkId", "./routes/profile/$id.tsx"),
  ]),
  route("p/share-feedback", "./routes/profile/share-feedback.tsx"),
  ...prefix("tools", [
    route("qr-generator", "./routes/qr-code/index.tsx"),
  ]),
]),

route(":linkUsername", "./routes/user-profile.tsx"),


...prefix("api", [
  route("auth/*", "./routes/api/better.tsx")
])
] satisfies RouteConfig;
