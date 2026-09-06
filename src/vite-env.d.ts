/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ORDER_INTAKE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
