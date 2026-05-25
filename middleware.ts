import { createServerClient } from "@supabase/ssr";

import {
  NextResponse,
  type NextRequest,
} from "next/server";

export async function middleware(
  request: NextRequest
) {
  let response =
    NextResponse.next({
      request,
    });

  const supabase =
    createServerClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,

      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY!,

      {
        cookies: {
          get(name) {
            return request.cookies.get(
              name
            )?.value;
          },

          set(
            name,
            value,
            options
          ) {
            request.cookies.set({
              name,
              value,
              ...options,
            });

            response =
              NextResponse.next({
                request,
              });

            response.cookies.set({
              name,
              value,
              ...options,
            });
          },

          remove(
            name,
            options
          ) {
            request.cookies.set({
              name,
              value: "",
              ...options,
            });

            response =
              NextResponse.next({
                request,
              });

            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

  const {
    data: { session },
  } =
    await supabase.auth.getSession();

  const protectedRoutes = [
    "/dashboard",
    "/portfolio",
    "/market",
    "/profile",
    "/calculator",
  ];

  const isProtectedRoute =
    protectedRoutes.some(
      (route) =>
        request.nextUrl.pathname.startsWith(
          route
        )
    );

  if (
    isProtectedRoute &&
    !session
  ) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/portfolio/:path*",
    "/market/:path*",
    "/profile/:path*",
    "/calculator/:path*",
  ],
};