import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/prefer-as-const": "off",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "../modules/*",
                "../../modules/*",
                "../../../modules/*",
                "../../../../modules/*",
                "@/modules/*",
              ],
              message: "modules 目录已废弃。请改为从 features 或 shared 导入。",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../app/*", "../../app/*", "../../../app/*", "../../../../app/*", "@/app/*"],
              message: "Feature 层禁止依赖 app 层。",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "../app/*",
                "../../app/*",
                "../../../app/*",
                "../features/*",
                "../../features/*",
                "../../../features/*",
                "@/app/*",
                "@/features/*",
              ],
              message: "shared 层禁止依赖 app/features 层。",
            },
          ],
        },
      ],
    },
  },
);
