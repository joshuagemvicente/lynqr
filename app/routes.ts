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

  layout("./routes/profile/_profile.layout.tsx", [
    ...prefix("profile", [
      index("./routes/profile/_index.tsx")
    ]),
  ]),

  ...prefix("api", [
    route("auth/*", "./routes/api/better.tsx")
  ])
])] satisfies RouteConfig;
