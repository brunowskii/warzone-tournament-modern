<<<<<<< HEAD
const withNextIntl = require('next-intl/plugin')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'supabase.co'],
  },
}

module.exports = withNextIntl(nextConfig)
=======
const withNextIntl = require('next-intl/plugin')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'supabase.co'],
  },
}

module.exports = withNextIntl(nextConfig)
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
