import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";


const excludedAuthPaths = ["/new",];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is in the excluded list
  if (excludedAuthPaths.includes(pathname)) {
    return await updateSession(request);
  }
  
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/"
  ],
};
