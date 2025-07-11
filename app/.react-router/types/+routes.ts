// Generated by React Router

import "react-router"

declare module "react-router" {
  interface Register {
    pages: Pages
    routeFiles: RouteFiles
  }
}

type Pages = {
  "/": {
    params: {};
  };
  "/login": {
    params: {};
  };
  "/signup": {
    params: {};
  };
  "/hub": {
    params: {};
  };
  "/profile": {
    params: {};
  };
  "/profile/add": {
    params: {};
  };
  "/api/auth/*": {
    params: {
      "*": string;
    };
  };
};

type RouteFiles = {
  "root.tsx": {
    id: "root";
    page: "/" | "/login" | "/signup" | "/hub" | "/profile" | "/profile/add" | "/api/auth/*";
  };
  "routes/home.tsx": {
    id: "routes/home";
    page: "/";
  };
  "./routes/auth/_auth.layout.tsx": {
    id: "routes/auth/_auth.layout";
    page: "/login" | "/signup";
  };
  "./routes/auth/login.tsx": {
    id: "routes/auth/login";
    page: "/login";
  };
  "./routes/auth/signup.tsx": {
    id: "routes/auth/signup";
    page: "/signup";
  };
  "./routes/hub/_hub.layout.tsx": {
    id: "routes/hub/_hub.layout";
    page: "/hub" | "/profile" | "/profile/add" | "/api/auth/*";
  };
  "./routes/hub/_index.tsx": {
    id: "routes/hub/_index";
    page: "/hub";
  };
  "./routes/profile/_profile.layout.tsx": {
    id: "routes/profile/_profile.layout";
    page: "/profile" | "/profile/add";
  };
  "./routes/profile/_index.tsx": {
    id: "routes/profile/_index";
    page: "/profile" | "/profile/add";
  };
  "./routes/profile/add.tsx": {
    id: "routes/profile/add";
    page: "/profile/add";
  };
  "./routes/api/better.tsx": {
    id: "routes/api/better";
    page: "/api/auth/*";
  };
};