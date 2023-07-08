import { NextRequest, NextResponse } from "next/server";

const { NEXT_PUBLIC_BASE_PROTOCOL, NEXT_PUBLIC_BASE_URL_PATH } = process.env;

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /examples (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|admin/|auth/|_next/|_static/|examples/|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  console.log("url in middleware: ", url);
  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get("host") || "localhost:3000";
  console.log("hostname in middleware: ", hostname);
  const origin = url.origin;
  console.log("origin in middleware: ", origin);

  const requestSubdomain = hostname.split(".")[0];
  // console.log("requestSubdomain in middleware: ", requestSubdomain);

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;
  // console.log("path in middleware: ", path);

  // const res = NextResponse.next();

  // res.headers.set("x-subdomain", requestSubdomain);

  // TODO mpm: make a "demo" page
  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname
          .replace(`.folio.pics`, "")
          .replace(`.folio-neon.vercel.app`, "")
      : hostname.replace(`.localhost:3000`, "");

  if (currentHost) {
    console.log("currentHost: ", currentHost);
    const hostToUse = currentHost.split(".")[0];
    console.log("hostToUse: ", hostToUse);
    const allowedOrigins = [
      `${NEXT_PUBLIC_BASE_PROTOCOL}${NEXT_PUBLIC_BASE_URL_PATH}`,
      `${NEXT_PUBLIC_BASE_PROTOCOL}${hostToUse}.${NEXT_PUBLIC_BASE_URL_PATH}`,
    ];
    console.log("allowedOrigins: ", allowedOrigins);

    if (allowedOrigins.includes(origin)) {
      console.log("origin is included");
      // res.headers.append("Access-Control-Allow-Origin", origin);
    } else {
      console.log("origin is NOT included");
    }
  }
  // TODO mpm: use this in future for admin route, etc.
  // rewrites for app pages
  // if (currentHost == "app") {
  //   if (
  //     url.pathname === "/login" &&
  //     (req.cookies.get("next-auth.session-token") ||
  //       req.cookies.get("__Secure-next-auth.session-token"))
  //   ) {
  //     url.pathname = "/";
  //     return NextResponse.redirect(url);
  //   }

  //   url.pathname = `/app${url.pathname}`;
  //   return NextResponse.rewrite(url);
  // }

  // rewrite root application to `/home` folder
  if (req.method === "OPTIONS") {
    return NextResponse.json({ status: 200, message: "OK" });
  }
  if (
    hostname === "localhost:3000" ||
    hostname === "folio-neon.vercel.app" ||
    hostname === "folio.pics"
  ) {
    // console.log(
    //   "req.url: ",
    //   req.url,
    //   "new URL(`${path}`, req.url: ",
    //   new URL(`${path}`, req.url)
    // );
    // return NextResponse.rewrite(new URL(`${path}`, req.url));
  }
  // rewrite everything else to `/_sites/[site] dynamic route
  const newUrl = new URL(`/feed/${currentHost}${path}`, req.url);
  console.log("newUrl: ", newUrl);
  return NextResponse.rewrite(newUrl);
}
