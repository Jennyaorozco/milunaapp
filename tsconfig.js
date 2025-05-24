{
  "compilerOptions": {
    "forceConsistentCasingInFileNames": true,
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "preserve",
    "moduleResolution": "node",
    "allowJs": true,
    "checkJs": false,
    "noEmit": true,
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "skipLibCheck": true,
    "incremental": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "./app",
    "./components",
    "./pages",
    ".next/lib",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
