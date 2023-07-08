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
  const hostname = req.headers.get("host") || "localhost:3000";
  const origin = url.origin;
  const requestSubdomain = hostname.split(".")[0];
  const path = url.pathname;

  // console.log("url in middleware: ", url);
  // console.log("hostname in middleware: ", hostname);
  // console.log("origin in middleware: ", origin);
  // console.log("requestSubdomain in middleware: ", requestSubdomain);
  // console.log("path in middleware: ", path);

  // const res = NextResponse.next();
  // res.headers.set("x-subdomain", requestSubdomain);

  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname
          .replace(`.folio.pics`, "")
          .replace(`.folio-neon.vercel.app`, "")
      : hostname.replace(`.localhost:3000`, "");

  if (currentHost) {
    const hostToUse = currentHost.split(".")[0];
    const allowedOrigins = [
      `${NEXT_PUBLIC_BASE_PROTOCOL}${NEXT_PUBLIC_BASE_URL_PATH}`,
      `${NEXT_PUBLIC_BASE_PROTOCOL}${hostToUse}.${NEXT_PUBLIC_BASE_URL_PATH}`,
    ];

    // console.log("currentHost: ", currentHost);
    // console.log("hostToUse: ", hostToUse);
    // console.log("allowedOrigins: ", allowedOrigins);

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
    return NextResponse.rewrite(new URL(`${path}`, req.url));
  }
  const newUrl = new URL(`/feed/${currentHost}${path}`, req.url);
  console.log("newUrl: ", newUrl);
  return NextResponse.rewrite(newUrl);
}
