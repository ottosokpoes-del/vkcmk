/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Google Analytics types
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// Performance API extensions
interface PerformanceEntry {
  processingStart?: number
  processingEnd?: number
  hadRecentInput?: boolean
  value?: number
}

declare const gtag: (...args: any[]) => void
