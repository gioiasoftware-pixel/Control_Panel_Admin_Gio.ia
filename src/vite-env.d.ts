/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROCESSOR_URL: string
  readonly VITE_WEB_APP_URL: string
  readonly VITE_API_URL: string
  readonly VITE_ADMIN_EMAIL: string
  readonly VITE_ADMIN_PASSWORD: string
  readonly VITE_JWT_SECRET: string
  readonly VITE_NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
