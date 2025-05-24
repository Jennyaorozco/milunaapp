/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "next/core-web-vitals",      // Reglas recomendadas por Next.js
    "eslint:recommended",        // Buenas prácticas básicas
    "plugin:@typescript-eslint/recommended", // Reglas específicas de TypeScript
    "plugin:react/recommended",  // Reglas para React
    "plugin:prettier/recommended", // Integración con Prettier
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    // Puedes personalizar las reglas aquí
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "react/react-in-jsx-scope": "off", // No se necesita con Next.js
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
