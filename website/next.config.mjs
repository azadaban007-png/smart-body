/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

// Sandbox preview only: allow the Base44 preview proxy host/origin to reach the
// dev server (HMR + dev assets). With the flag unset, behavior is unchanged.
if (process.env.BASE44_PREVIEW_MODE === '1') {
  const origins = []
  if (process.env.BASE44_PUBLIC_HOST_SUFFIX) {
    origins.push('3000-' + process.env.BASE44_PUBLIC_HOST_SUFFIX)
  }
  if (process.env.BASE44_SANDBOX_HOST_DOMAIN) {
    origins.push('*.' + process.env.BASE44_SANDBOX_HOST_DOMAIN)
  }
  if (origins.length) nextConfig.allowedDevOrigins = origins
}

export default nextConfig
