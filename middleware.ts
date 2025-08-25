<<<<<<< HEAD
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'it'],

  // Used when no locale matches
  defaultLocale: 'en'
})

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(it|en)/:path*']
}
=======
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'it'],

  // Used when no locale matches
  defaultLocale: 'en'
})

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(it|en)/:path*']
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
