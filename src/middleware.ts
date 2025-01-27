import {NextRequest, NextResponse} from "next/server";
import getSession from "@/lib/session";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/create-account": true,
  "/login": true,
  "/sms": true,
}

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname];

  if (session.id) {
    // 로그인한 상태
    if (exists) {
      // public only url에 접근 시 리다이렉트
      return NextResponse.redirect(new URL("/products", request.url));
    }
  } else {
    // 로그아웃 상태
    if (!exists) {
      // 회원용 url에 접근 시 리다이렉트
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - public (static assets)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|public|favicon.ico).*)',
  ],
}