import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["components/**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Public assets live on a configurable Supabase hostname, so plain img tags are intentional.
      "@next/next/no-img-element": "off",
    },
  },
  {
    files: ["components/portfolio/**/*.{js,jsx}"],
    rules: {
      // These imported motion primitives deliberately schedule state from observers and timers.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
]);

export default eslintConfig;
