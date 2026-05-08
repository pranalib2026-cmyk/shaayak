import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const isAuthPage = url.pathname.startsWith('/login')
  const isAdminRoute = url.pathname.startsWith('/admin')
  const isDashboardRoute = url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/track')

  if (!user && (isDashboardRoute || isAdminRoute)) {
    // If not logged in and accessing protected route, redirect to login
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    // If logged in and accessing auth page, redirect to landing page
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Basic RBAC for admin routes
  if (user && isAdminRoute) {
    // You would typically check the user's role in the database or user_metadata here.
    // Assuming user_metadata.role === 'admin'
    if (user.user_metadata?.role !== 'admin') {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
